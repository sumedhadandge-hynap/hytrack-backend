import {
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCityDto {
  @IsInt()
  countryId!: number;

  @IsInt()
  stateId!: number;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;
}