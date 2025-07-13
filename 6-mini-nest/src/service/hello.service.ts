import { Injectable } from '../decorators';

@Injectable()
export class HelloService {
  async sayHello(): Promise<string> {
    return 'Hello from mini-nest!';
  }
}
