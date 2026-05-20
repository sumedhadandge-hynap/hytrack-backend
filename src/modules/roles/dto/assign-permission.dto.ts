import {
  IsBoolean,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class AssignPermissionDto {
  @IsNumber()
  @Min(1)
  permission_id!: number;

  @IsBoolean()
  @IsOptional()
  can_view?: boolean;

  @IsBoolean()
  @IsOptional()
  can_create?: boolean;

  @IsBoolean()
  @IsOptional()
  can_update?: boolean;

  @IsBoolean()
  @IsOptional()
  can_delete?: boolean;
}