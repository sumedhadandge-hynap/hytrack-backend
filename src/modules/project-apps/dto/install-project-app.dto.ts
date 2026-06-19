import {
  IsNumber,
  IsOptional,
} from 'class-validator';

export class InstallProjectAppDto {
  @IsNumber()
  project_id!: number;

  @IsNumber()
  app_id!: number;

  @IsOptional()
  @IsNumber()
  version_id?: number;
}