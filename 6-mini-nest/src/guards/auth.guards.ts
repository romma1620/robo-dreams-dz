import { Request, Response } from 'express';
import { CanActivate } from '../decorators';

export class AuthGuard implements CanActivate {
  canActivate({ req, res }: { req: Request; res: Response }): boolean {
    const apiKey = req.headers['x-api-key'];
    return apiKey === 'secret';
  }
}
