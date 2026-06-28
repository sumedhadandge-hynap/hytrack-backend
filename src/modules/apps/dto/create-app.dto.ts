import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAppDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  app_type_id: number;

  @IsOptional()
  @IsString()
  icon_url?: string;
}