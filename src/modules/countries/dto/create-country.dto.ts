// create-country.dto.ts

import {
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCountryDto {

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  iso3?: string;

  @IsOptional()
  @IsString()
  iso2?: string;

  @IsOptional()
  @IsString()
  phone_code?: string;

  @IsOptional()
  @IsString()
  capital?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}