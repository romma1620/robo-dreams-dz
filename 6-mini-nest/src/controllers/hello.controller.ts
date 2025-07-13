import { z } from 'zod';
import { Body, Controller, Delete, Get, Injectable, Param, Patch, Post, Put, Query, UsePipe } from '../decorators';
import { ZodValidationPipe } from '../pipes';

const CreateUserDto = z.object({
  name: z.string().min(1),
  age: z.number().int().min(0),
});

@Injectable()
@Controller('/users')
export class UsersController {
  @Get('/')
  getAllUsers(
   @Query('limit')  limit?: string,
   @Query('offset') offset?: string
  ) {
    const users = [
      { id: '1', name: 'Alice', age: 30 },
      { id: '2', name: 'Bob',   age: 25 },
    ];
    if (limit != null && offset != null) {
      const l = parseInt(limit, 10);
      const o = parseInt(offset, 10);
      return users.slice(o, o + l);
    }
    return users;
  }

  @Get('/:id')
  getUser(
   @Param('id') id: string,
   @Query('verbose') verbose?: string
  ) {
    return { id, verbose: verbose === 'true' };
  }

  @Post('/')
  @UsePipe(ZodValidationPipe.bind(null, CreateUserDto))
  createUser(
   @Body() dto: z.infer<typeof CreateUserDto>
  ) {
    return { id: '1', ...dto };
  }

  @Put('/:id')
  @UsePipe(ZodValidationPipe.bind(null, CreateUserDto))
  replaceUser(
   @Param('id') id: string,
   @Body() dto: z.infer<typeof CreateUserDto>
  ) {
    return { id, ...dto };
  }

  @Patch('/:id')
  patchUser(
   @Param('id') id: string,
   @Body() dto: Partial<z.infer<typeof CreateUserDto>>
  ) {
    return { id, patched: dto };
  }

  @Delete('/:id')
  deleteUser(
   @Param('id') id: string
  ) {
    return { id, deleted: true };
  }
}
