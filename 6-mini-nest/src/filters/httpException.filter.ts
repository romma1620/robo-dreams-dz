import { Request, Response } from 'express';
import { ExceptionFilter } from '../decorators';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, { req, res }: { req: Request; res: Response }) {
    if (exception.status && exception.message) {
      return res
        .status(exception.status)
        .json({ status: 'error', message: exception.message });
    }
    console.error('Unhandled exception:', exception);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      details: exception.message || exception.toString(),
    });
  }
}
