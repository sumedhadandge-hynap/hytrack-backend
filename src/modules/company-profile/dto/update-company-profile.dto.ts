import {
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateCompanyProfileDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logo_url?: string;

  @IsOptional()
  @IsString()
  favicon_url?: string;

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
  company_code?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsObject()
  custom_fields?: any;
}