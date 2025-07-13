const INJECT_TOKEN_KEY = Symbol('inject_tokens');

export function Inject(token?: any): ParameterDecorator {
  return (target, _propertyKey, parameterIndex) => {
    const existing: Record<number, any> =
      Reflect.getOwnMetadata(INJECT_TOKEN_KEY, target) || {};
    existing[parameterIndex] = token;
    Reflect.defineMetadata(INJECT_TOKEN_KEY, existing, target);
  };
}

export { INJECT_TOKEN_KEY };
