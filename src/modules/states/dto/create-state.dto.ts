import {
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStateDto {
  @IsInt()
  countryId!: number;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  stateCode?: string;

  @IsOptional()
  @IsString()
  description?: string;
}