import 'reflect-metadata';
import { ROUTES, RouteDefinition } from './controller';

function createMethodDecorator(method: string) {
  return function(path: string = ''): MethodDecorator {
    return (target, propertyKey) => {
      const constructor = target.constructor;
      const routes: RouteDefinition[] =
        Reflect.getMetadata(ROUTES, constructor) || [];

      routes.push({
        method,
        path,
        handlerName: propertyKey as string,
      });

      Reflect.defineMetadata(ROUTES, routes, constructor);
    };
  };
}

export const Get    = createMethodDecorator('get');
export const Post   = createMethodDecorator('post');
export const Put    = createMethodDecorator('put');
export const Patch  = createMethodDecorator('patch');
export const Delete = createMethodDecorator('delete');
