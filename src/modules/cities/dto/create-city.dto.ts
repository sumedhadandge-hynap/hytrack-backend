// create-city.dto.ts

import {
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateCityDto {

  @IsString()
  name!: string;

  @IsNumber()
  country_id!: number;

  @IsNumber()
  state_id!: number;
}