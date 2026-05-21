import { PartialType }
from '@nestjs/mapped-types';

import { CreateAppFieldDto }
from './create-app-field.dto';

export class UpdateAppFieldDto
  extends PartialType(CreateAppFieldDto) {}