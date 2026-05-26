import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  FileInterceptor,
} from '@nestjs/platform-express';

import type { Express }
from 'express';

import { UploadService }
from './upload.service';


@Controller('api/upload')
export class UploadController {

  constructor(
    private readonly uploadService:
      UploadService,
  ) {}

  @Post('logo')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async uploadLogo(
    @UploadedFile()
    file: Express.Multer.File,
  ) {

    const result =
      await this.uploadService
        .saveAppLogo(file);

    return {
      status: 'success',
      code: 201,
      message:
        'Logo uploaded successfully',
      result,
    };
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async uploadAvatar(
    @UploadedFile()
    file: Express.Multer.File,
  ) {

    const result =
      await this.uploadService
        .saveAvatar(file);

    return {
      status: 'success',
      code: 201,
      message:
        'Avatar uploaded successfully',
      result,
    };
  }
}