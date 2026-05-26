import { Module } from '@nestjs/common';

import { AppRecordValuesController } from './app-record-values.controller';
import { AppRecordValuesService } from './app-record-values.service';

@Module({
  controllers: [AppRecordValuesController],
  providers: [AppRecordValuesService],
  exports: [AppRecordValuesService],
})
export class AppRecordValuesModule {}