import {
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';


export class CreateProjectDto {
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
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  google_map_link?: string;

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
}