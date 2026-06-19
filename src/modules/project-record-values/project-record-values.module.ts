import { Module } from '@nestjs/common';

import { ProjectRecordValuesController } from './project-record-values.controller';
import { ProjectRecordValuesService } from './project-record-values.service';

@Module({
  controllers: [ProjectRecordValuesController],
  providers: [ProjectRecordValuesService],
  exports: [ProjectRecordValuesService],
})
export class ProjectRecordValuesModule {}