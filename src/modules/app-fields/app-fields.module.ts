import { Module } from '@nestjs/common';

import { AppFieldsController }
from './app-fields.controller';

import { AppFieldsService }
from './app-fields.service';

@Module({
  controllers: [AppFieldsController],
  providers: [AppFieldsService],
  exports: [AppFieldsService],
})
export class AppFieldsModule {}