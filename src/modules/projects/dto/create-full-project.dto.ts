import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { ProjectFieldValueDto } from '../../project-fields/dto/create-project-field.dto';

export class CreateFullProjectDto {
  @IsNumber()
  company_id!: number;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsNumber()
  country_id?: number;

  @IsOptional()
  @IsNumber()
  state_id?: number;

  @IsOptional()
  @IsNumber()
  city_id?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectFieldValueDto)
  fields?: ProjectFieldValueDto[];
}