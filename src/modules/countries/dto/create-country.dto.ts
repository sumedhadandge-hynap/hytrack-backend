import {
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCountryDto {
  @IsString()
  name!: string;

  @IsString()
  isoCode!: string;

  @IsOptional()
  @IsString()
  phoneCode?: string;

  @IsOptional()
  @IsString()
  description?: string;
}