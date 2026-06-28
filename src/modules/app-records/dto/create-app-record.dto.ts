import {
  Allow,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class CreateAppRecordValueDto {
  @IsOptional()
  @IsNumber()
  field_id?: number;

  @IsOptional()
  @IsString()
  field_key?: string;

  @Allow()
  value: any;
}

export class CreateAppRecordDto {
  @IsNumber()
  app_id: number;

  @IsOptional()
  @IsNumber()
  company_id?: number;

  @IsOptional()
  @IsNumber()
  project_id?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAppRecordValueDto)
  values?: CreateAppRecordValueDto[];
}