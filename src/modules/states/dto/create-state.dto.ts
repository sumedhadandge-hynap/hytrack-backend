// create-state.dto.ts

import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStateDto {

  @IsString()
  name!: string;

  @IsNumber()
  country_id!: number;

  @IsOptional()
  @IsString()
  state_code?: string;
}