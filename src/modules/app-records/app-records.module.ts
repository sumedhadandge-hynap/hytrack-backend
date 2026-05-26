import { Module } from '@nestjs/common';

import { AppRecordsController } from './app-records.controller';
import { AppRecordsService } from './app-records.service';

@Module({
  controllers: [AppRecordsController],
  providers: [AppRecordsService],
  exports: [AppRecordsService],
})
export class AppRecordsModule {}