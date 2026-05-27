import { PartialType }
from '@nestjs/mapped-types';

import { CreateProjectFieldDto }
from './create-project-field.dto';

export class UpdateProjectFieldDto
  extends PartialType(CreateProjectFieldDto) {}