import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';      // ← імпортуємо весь модуль
import { ZipService } from './zip.service';

@Controller()
export class ZipController {
  constructor(private readonly zipService: ZipService) {}

  @Post('zip')
  @UseInterceptors(
   FileInterceptor('file', {
     storage: multer.memoryStorage(),
   }),
  )
  async uploadZip(
   @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.zipService.handleZip(file);
  }
}
