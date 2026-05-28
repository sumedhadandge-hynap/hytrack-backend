import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProjectFieldDto {

  @IsNumber()
  project_id!: number;

  @IsString()
  label!: string;

  @IsString()
  field_key!: string;

  @IsString()
  field_type!: string;

  @IsOptional()
  @IsNumber()
  reference_app_id?: number;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  default_value?: any;

  @IsOptional()
  dropdown_options?: any;

  @IsOptional()
  validation_rules?: any;

  @IsOptional()
  @IsBoolean()
  is_required?: boolean;

  @IsOptional()
  @IsBoolean()
  is_visible?: boolean;

  @IsOptional()
  @IsBoolean()
  is_editable?: boolean;

  @IsOptional()
  @IsNumber()
  order_index?: number;
}

export class ProjectFieldValueDto {

  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  label!: string;

  @IsString()
  field_key!: string;

  @IsString()
  field_type!: string;

  @IsOptional()
  @IsNumber()
  reference_app_id?: number;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  default_value?: any;

  @IsOptional()
  dropdown_options?: any;

  @IsOptional()
  validation_rules?: any;

  @IsOptional()
  @IsBoolean()
  is_required?: boolean;

  @IsOptional()
  @IsBoolean()
  is_visible?: boolean;

  @IsOptional()
  @IsBoolean()
  is_editable?: boolean;

  @IsOptional()
  @IsNumber()
  order_index?: number;

  @IsOptional()
  value?: any;
}