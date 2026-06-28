import {
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class GroupAppItemDto {
  @IsNumber()
  appId!: number;

  @IsNumber()
  sortOrder!: number;
}

export class AddAppsToGroupDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupAppItemDto)
  apps!: GroupAppItemDto[];
}