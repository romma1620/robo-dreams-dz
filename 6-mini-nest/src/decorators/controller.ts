import 'reflect-metadata';

export const CONTROLLER_PREFIX = Symbol('controller_prefix');
export const ROUTES = Symbol('routes');

export interface RouteDefinition {
  method: string;
  path: string;
  handlerName: string;
}

export function Controller(prefix: string = ''): ClassDecorator {
  return target => {
    Reflect.defineMetadata(CONTROLLER_PREFIX, prefix, target);
    if (!Reflect.hasMetadata(ROUTES, target)) {
      Reflect.defineMetadata(ROUTES, [], target);
    }
  };
}
