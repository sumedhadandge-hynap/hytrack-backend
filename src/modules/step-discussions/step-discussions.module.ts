import { Module }
from '@nestjs/common';

import { StepDiscussionsController }
from './step-discussions.controller';

import { StepDiscussionsService }
from './step-discussions.service';

@Module({
  controllers: [
    StepDiscussionsController,
  ],

  providers: [
    StepDiscussionsService,
  ],

  exports: [
    StepDiscussionsService,
  ],
})
export class StepDiscussionsModule {}