import 'reflect-metadata';

export const CONTROLLER_PIPES_META = Symbol('controller_pipes_meta');
export const METHOD_PIPES_META     = Symbol('method_pipes_meta');
export const PARAM_PIPES_META      = Symbol('param_pipes_meta');

export function UsePipe(...pipes: any[]): any {
  return (
   target: any,
   propertyKey?: string,
   descriptorOrIndex?: PropertyDescriptor | number
  ) => {
    if (typeof descriptorOrIndex === 'number') {
      const existing: Record<number, any[]> =
       Reflect.getOwnMetadata(PARAM_PIPES_META, target.constructor, propertyKey!) || {};
      existing[descriptorOrIndex] = [
        ...(existing[descriptorOrIndex] || []),
        ...pipes
      ];
      Reflect.defineMetadata(
       PARAM_PIPES_META,
       existing,
       target.constructor,
       propertyKey!
      );
    } else if (propertyKey) {
      const existing: any[] =
       Reflect.getOwnMetadata(METHOD_PIPES_META, target.constructor, propertyKey) || [];
      Reflect.defineMetadata(
       METHOD_PIPES_META,
       [...existing, ...pipes],
       target.constructor,
       propertyKey
      );
    } else {
      const existing: any[] =
       Reflect.getOwnMetadata(CONTROLLER_PIPES_META, target) || [];
      Reflect.defineMetadata(
       CONTROLLER_PIPES_META,
       [...existing, ...pipes],
       target
      );
    }
  };
}
