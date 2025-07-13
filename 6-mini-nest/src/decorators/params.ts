import 'reflect-metadata';

export const PARAM_META = Symbol('param_meta');

export type ParamType = 'param' | 'query' | 'body';

export interface ParamDefinition {
  index: number;
  type: ParamType;
  name?: string;
}

function createParamDecorator(type: ParamType) {
  return (name?: string): ParameterDecorator => {
    return (target, _propertyKey, parameterIndex) => {
      const existing: ParamDefinition[] =
        Reflect.getOwnMetadata(PARAM_META, target.constructor, _propertyKey!) || [];
      existing.push({ index: parameterIndex, type, name });
      Reflect.defineMetadata(PARAM_META, existing, target.constructor, _propertyKey!);
    };
  };
}

export const Param = createParamDecorator('param');
export const Query = createParamDecorator('query');

export function Body(): ParameterDecorator {
  return (target, _propertyKey, parameterIndex) => {
    const existing: ParamDefinition[] =
      Reflect.getOwnMetadata(PARAM_META, target.constructor, _propertyKey!) || [];
    existing.push({ index: parameterIndex, type: 'body' });
    Reflect.defineMetadata(PARAM_META, existing, target.constructor, _propertyKey!);
  };
}
