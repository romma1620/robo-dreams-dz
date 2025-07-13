import { Injectable, UseFilter, UseGuard, Get, Controller } from '../decorators';
import { AuthGuard } from '../guards/auth.guards';
import { HttpExceptionFilter } from '../filters';


@Injectable()
@UseGuard(AuthGuard)
@UseFilter(HttpExceptionFilter)
@Controller('/secure')
export class SecureController {
  @Get('/')
  getSecure(req: any, res: any) {
    res.json({ data: 'This is secured data' });
  }


  @Get('/error')
  @UseFilter(HttpExceptionFilter)
  getError() {
    throw new Error('Oops, something went wrong');
  }
}
