import { PartialType }
from '@nestjs/mapped-types';

import { CreateFullProjectDto }
from './create-full-project.dto';

export class UpdateFullProjectDto
  extends PartialType(CreateFullProjectDto) {}