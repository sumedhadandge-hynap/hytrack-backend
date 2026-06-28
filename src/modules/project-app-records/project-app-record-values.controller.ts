import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectAppRecordsService } from './project-app-records.service';
import { CreateProjectAppRecordValueDto } from './dto/create-project-app-record-value.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/project-app-record-values')
export class ProjectAppRecordValuesController {
  constructor(
    private readonly projectAppRecordsService: ProjectAppRecordsService,
  ) {}

  @Post()
  async saveValue(
    @Body() dto: CreateProjectAppRecordValueDto,
  ) {
    const result =
      await this.projectAppRecordsService.saveSingleValue(
        dto,
      );

    return {
      status: 'success',
      code: 201,
      message: 'Record value saved successfully',
      result,
    };
  }
}