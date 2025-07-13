import 'reflect-metadata';
import { Request, Response } from 'express';

export const CONTROLLER_FILTERS_META = Symbol('controller_filters_meta');
export const METHOD_FILTERS_META     = Symbol('method_filters_meta');

export interface ExceptionFilter {
  catch(exception: any, context: { req: Request; res: Response }): any;
}

export function UseFilter(...filters: any[]): ClassDecorator & MethodDecorator {
  return (
    target: Function | Object,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) => {
    if (propertyKey !== undefined) {
      const constructor = (target as any).constructor;
      const existing: any[] =
        Reflect.getOwnMetadata(METHOD_FILTERS_META, constructor, propertyKey) || [];
      Reflect.defineMetadata(
        METHOD_FILTERS_META,
        [...existing, ...filters],
        constructor,
        propertyKey
      );
    } else {
      const ctor = target as Function;
      const existing: any[] =
        Reflect.getOwnMetadata(CONTROLLER_FILTERS_META, ctor) || [];
      Reflect.defineMetadata(
        CONTROLLER_FILTERS_META,
        [...existing, ...filters],
        ctor
      );
    }
  };
}
