import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export function ZBody<T>(schema: ZodSchema<T>) {
  const decorator = createParamDecorator(
   async (_data: unknown, ctx: ExecutionContext): Promise<T> => {
     const req = ctx.switchToHttp().getRequest();
     try {
       const parsed = await schema.parseAsync(req.body);
       req.body = parsed;
       return parsed;
     } catch (err: unknown) {
       if (err instanceof ZodError) {
         const errorMessage = err.errors
          .map(issue => `${issue.path.join('.')}: ${issue.message}`)
          .join('; ');
         throw new BadRequestException({
           message: errorMessage || 'Validation failed',
           errors: err.errors,
           statusCode: 400,
         });
       }
       throw err;
     }
   },
  );
  return decorator();
}
