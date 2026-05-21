import { PartialType }
from '@nestjs/mapped-types';

import { CreateAppStepDto }
from './create-app-step.dto';

export class UpdateAppStepDto
  extends PartialType(CreateAppStepDto) {}