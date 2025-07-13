const INJECTABLE_KEY = Symbol('injectable');

export function Injectable(): ClassDecorator {
  return target => {
    Reflect.defineMetadata(INJECTABLE_KEY, true, target);
  };
}

export { INJECTABLE_KEY };
