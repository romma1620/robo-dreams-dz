import 'reflect-metadata';

export const CONTROLLER_GUARDS_META = Symbol('controller_guards_meta');
export const METHOD_GUARDS_META     = Symbol('method_guards_meta');

export interface CanActivate {
  canActivate(context: { req: any; res: any }): boolean | Promise<boolean>;
}

export function UseGuard(...guards: any[]): ClassDecorator & MethodDecorator {
  return (
    target: Function | Object,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) => {
    if (propertyKey !== undefined) {
      const constructor = (target as any).constructor;
      const existing: any[] =
        Reflect.getOwnMetadata(METHOD_GUARDS_META, constructor, propertyKey) || [];
      Reflect.defineMetadata(
        METHOD_GUARDS_META,
        [...existing, ...guards],
        constructor,
        propertyKey
      );
    } else {
      const constructor = target as Function;
      const existing: any[] =
        Reflect.getOwnMetadata(CONTROLLER_GUARDS_META, constructor) || [];
      Reflect.defineMetadata(
        CONTROLLER_GUARDS_META,
        [...existing, ...guards],
        constructor
      );
    }
  };
}
