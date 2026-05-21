import { Module } from '@nestjs/common';

import { AppStepsController }
from './app-steps.controller';

import { AppStepsService }
from './app-steps.service';

@Module({
  controllers: [AppStepsController],
  providers: [AppStepsService],
  exports: [AppStepsService],
})
export class AppStepsModule {}