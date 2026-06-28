import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAppVersionDto {
  @IsNumber()
  app_id: number;

  @IsOptional()
  @IsString()
  version_name?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}