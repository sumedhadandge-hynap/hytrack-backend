import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
from '../auth/guards/jwt-auth.guard';

import { ProjectRecordValuesService }
from './project-record-values.service';

import { BulkProjectRecordValuesDto }
from './dto/bulk-project-record-values.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/project-record-values')
export class ProjectRecordValuesController {
  constructor(
    private readonly projectRecordValuesService:
      ProjectRecordValuesService,
  ) {}

  @Post('bulk')
  async bulkSave(
    @Body() dto: BulkProjectRecordValuesDto,
  ) {
    const result =
      await this.projectRecordValuesService
        .bulkSave(dto);

    return {
      status: 'success',
      code: 201,
      message: 'Project values saved successfully',
      result,
    };
  }
            
  @Get('project/:projectId')
  async findByProject(
    @Param('projectId', ParseIntPipe)
    projectId: number,
  ) {
    const result =
      await this.projectRecordValuesService
        .findByProject(projectId);

    return {
      status: 'success',
      code: 200,
      message: 'Project values fetched successfully',
      result,
    };
  }
}