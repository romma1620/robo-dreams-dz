import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import { SecureController, UsersController } from './controllers';
import {
  CONTROLLER_PIPES_META,
  CONTROLLER_PREFIX,
  METHOD_PIPES_META,
  PARAM_META,
  PARAM_PIPES_META,
  CONTROLLER_GUARDS_META,
  METHOD_GUARDS_META,
  ParamDefinition,
  RouteDefinition,
  ROUTES
} from './decorators';
import { Container } from './container';

declare module 'express-serve-static-core' {
  interface Application {
    usePipe(...pipes: any[]): void;
  }
}

export function createApp() {
  const app = express();
  app.use(express.json());

  const globalPipes: any[] = [];
  app.usePipe = (...pipes: any[]) => globalPipes.push(...pipes);

  const controllers = [UsersController, SecureController];

  for (const Ctrl of controllers) {
    const prefix: string           = Reflect.getMetadata(CONTROLLER_PREFIX, Ctrl) || '';
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTES, Ctrl) || [];
    const controllerPipes: any[]    = Reflect.getOwnMetadata(CONTROLLER_PIPES_META, Ctrl) || [];
    const controllerGuards: any[]   = Reflect.getOwnMetadata(CONTROLLER_GUARDS_META, Ctrl) || [];
    const instance = Container.resolve<any>(Ctrl);

    for (const { method, path, handlerName } of routes) {
      (app as any)[method](
       prefix + path,
       async (req: Request, res: Response, next: NextFunction) => {
         const methodGuards: any[] =
          Reflect.getOwnMetadata(METHOD_GUARDS_META, Ctrl, handlerName) || [];
         for (const Guard of [...controllerGuards, ...methodGuards]) {
           const inst = typeof Guard === 'function' ? new Guard() : Guard;
           const can = await inst.canActivate({ req, res });
           if (!can) {
             return res.status(403).json({ error: 'Forbidden' });
           }
         }

         try {
           const paramsMeta: ParamDefinition[] =
            Reflect.getOwnMetadata(PARAM_META, Ctrl, handlerName) || [];

           if (paramsMeta.length === 0) {
             const result = await instance[handlerName](req, res);
             return result !== undefined ? res.json(result) : res.end();
           }

           const methodPipes: any[] =
            Reflect.getOwnMetadata(METHOD_PIPES_META, Ctrl, handlerName) || [];
           const paramPipesMap: Record<number, any[]> =
            Reflect.getOwnMetadata(PARAM_PIPES_META, Ctrl, handlerName) || {};

           const args: any[] = [];
           for (const { index, type, name } of paramsMeta) {
             let value: any;
             if (type === 'param') value = name ? req.params[name] : req.params;
             if (type === 'query') value = name ? req.query[name]  : req.query;
             if (type === 'body')  value = req.body;

             const pipes = [
               ...globalPipes,
               ...controllerPipes,
               ...methodPipes,
               ...(paramPipesMap[index] || [])
             ];

             for (const Pipe of pipes) {
               const inst = typeof Pipe === 'function' ? new Pipe() : Pipe;
               if (typeof inst.transform === 'function') {
                 value = await inst.transform(value);
               } else {
                 value = await inst(value);
               }
             }

             args[index] = value;
           }

           const result = await (instance[handlerName] as Function)(...args);
           if (result !== undefined) {
             return res.json(result);
           }
           res.end();
         } catch (err: any) {
           next(err);
         }
       }
      );
    }
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err.status && err.message) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
