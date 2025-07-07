import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [ctx.getHandler(), ctx.getClass()],
    );
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest();
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== 'im_rd_student') {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}
