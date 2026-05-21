 import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAppVersionDto {

  @IsNumber()
  app_id!: number;

  @IsNumber()
  @IsOptional()
  version_number?: number;

  @IsString()
  @IsNotEmpty()
  version_name!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}