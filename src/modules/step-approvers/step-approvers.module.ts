import { Module }
from '@nestjs/common';

import { StepApproversController }
from './step-approvers.controller';

import { StepApproversService }
from './step-approvers.service';

@Module({
  controllers: [
    StepApproversController,
  ],

  providers: [
    StepApproversService,
  ],

  exports: [
    StepApproversService,
  ],
})
export class StepApproversModule {}