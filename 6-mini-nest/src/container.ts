import 'reflect-metadata';
import { INJECT_TOKEN_KEY, INJECTABLE_KEY } from './decorators';

export class Container {
  private static instances = new Map<any, any>();

  static resolve<T>(target: new (...args: any[]) => T): T {
    if (Container.instances.has(target)) {
      return Container.instances.get(target);
    }

    if (!Reflect.getMetadata(INJECTABLE_KEY, target)) {
      throw new Error(`Cannot resolve unmarked dependency: ${target.name}`);
    }

    const paramTypes: any[] =
      Reflect.getMetadata('design:paramtypes', target) || [];
    const injectTokens: Record<number, any> =
      Reflect.getOwnMetadata(INJECT_TOKEN_KEY, target) || {};

    const args = paramTypes.map((param, idx) => {
      const token = injectTokens[idx] || param;
      return Container.resolve(token);
    });

    const instance = new target(...args);
    Container.instances.set(target, instance);
    return instance;
  }
}
