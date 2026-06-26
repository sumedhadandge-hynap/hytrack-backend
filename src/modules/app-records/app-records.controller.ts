import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { AppRecordsService } from './app-records.service';
import { CreateAppRecordDto } from './dto/create-app-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/app-records')
export class AppRecordsController {
  constructor(private readonly appRecordsService: AppRecordsService) {}

  @Post()
  async create(@Body() dto: CreateAppRecordDto, @Req() req: any) {
    const result = await this.appRecordsService.create(dto, req.user?.id);

    return {
      status: 'success',
      code: 201,
      message: 'Record created successfully',
      result,
    };
  }

  @Get('app/:appId')
  async findByApp(
    @Param('appId', ParseIntPipe) appId: number,
    @Query('version_id', ParseIntPipe) versionId: number,
  ) {
    const result = await this.appRecordsService.findByApp(appId, versionId);

    return {
      status: 'success',
      code: 200,
      message: 'App records fetched successfully',
      result,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.appRecordsService.findOne(id);

    return {
      status: 'success',
      code: 200,
      message: 'Record fetched successfully',
      result,
    };
  }
}