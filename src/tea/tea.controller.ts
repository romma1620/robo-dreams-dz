import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Put,
  Delete, UseGuards,
} from '@nestjs/common';
import { TeaService } from './tea.service';
import { Public } from '../common/decorators/public.decorator';
import { ZBody } from '../common/decorators/zbody.decorator';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { TeaSchema, UpdateTeaSchema, CreateTeaDto, UpdateTeaDto } from './schemas/tea.schema';

@UseGuards(ApiKeyGuard)
@Controller('tea')
export class TeaController {
  constructor(private readonly svc: TeaService) {}

  @Public()
  @Get()
  findAll(@Query('minRating') minRating?: number) {
    return this.svc.findAll(minRating);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  async create(@ZBody(TeaSchema) dto: CreateTeaDto) {
    return this.svc.create(dto);
  }

  @Put(':id')
  update(
   @Param('id') id: string,
   @ZBody(UpdateTeaSchema) dto: UpdateTeaDto,
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
