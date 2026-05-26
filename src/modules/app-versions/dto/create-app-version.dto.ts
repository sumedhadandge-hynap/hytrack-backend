import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAppVersionDto {

  @IsNumber()
  app_id!: number;

  @IsOptional()
  @IsNumber()
  version_number?: number;

  @IsString()
  version_name!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}