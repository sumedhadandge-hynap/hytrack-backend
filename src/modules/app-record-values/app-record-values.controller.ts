import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppRecordValuesService } from './app-record-values.service';
import { CreateAppRecordValueDto } from './dto/create-app-record-value.dto';
import { BulkAppRecordValuesDto } from './dto/bulk-app-record-values.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/app-record-values')
export class AppRecordValuesController {
  constructor(
    private readonly appRecordValuesService:
      AppRecordValuesService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateAppRecordValueDto,
  ) {
    const result =
      await this.appRecordValuesService.create(dto);

    return {
      status: 'success',
      code: 201,
      message: 'Record value saved successfully',
      result,
    };
  }

  @Post('bulk')
  async bulkCreate(
    @Body() dto: BulkAppRecordValuesDto,
  ) {
    const result =
      await this.appRecordValuesService.bulkCreate(dto);

    return {
      status: 'success',
      code: 201,
      message: 'Record values saved successfully',
      result,
    };
  }

  @Get('record/:recordId')
  async findByRecord(
    @Param('recordId', ParseIntPipe)
    recordId: number,
  ) {
    const result =
      await this.appRecordValuesService.findByRecord(
        recordId,
      );

    return {
      status: 'success',
      code: 200,
      message: 'Record values fetched successfully',
      result,
    };
  }
}