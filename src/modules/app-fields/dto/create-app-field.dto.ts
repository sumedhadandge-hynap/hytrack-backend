import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAppFieldDto {

  @IsNumber()
  app_id!: number;

  @IsNumber()
  step_id!: number;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsString()
  @IsNotEmpty()
  field_key!: string;

  @IsString()
  @IsNotEmpty()
  field_type!: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsString()
  help_text?: string;

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
  is_unique?: boolean;

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
  @IsNumber()
  reference_app_id?: number;

  @IsOptional()
  @IsNumber()
  reference_display_field_id?: number;
}