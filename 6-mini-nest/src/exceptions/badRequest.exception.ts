import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {
  constructor(message: string | string[]) {
    const msg = Array.isArray(message) ? message.join('; ') : message;
    super(400, msg);
  }
}
