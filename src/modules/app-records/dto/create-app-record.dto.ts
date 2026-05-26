import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAppRecordDto {
  @IsNumber()
  app_id!: number;

  @IsOptional()
  @IsNumber()
  version_id?: number;

  @IsOptional()
  @IsNumber()
  project_id?: number;

  @IsOptional()
  @IsString()
  status?: string;
}