import { ZodSchema } from 'zod';
import { BadRequestException } from '../exceptions';

export class ZodValidationPipe {
  constructor(private schema: ZodSchema<any>) {}

  async transform(value: any) {
    try {
      return await this.schema.parseAsync(value);
    } catch (err: any) {
      const errors = err.errors?.map((e: any) =>
       `${e.path.join('.')}: ${e.message}`
      );
      throw new BadRequestException(errors || err.message);
    }
  }
}
