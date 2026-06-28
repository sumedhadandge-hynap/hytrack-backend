import { PartialType } from '@nestjs/mapped-types';
import { CreateAppGroupDto } from './create-app-group.dto';

export class UpdateAppGroupDto extends PartialType(
  CreateAppGroupDto,
) {}