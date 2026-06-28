import {
  IsIn,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class InstallAppDto {
  @IsNumber()
  app_id: number;

  @IsIn(['master', 'standard'])
  install_type: 'master' | 'standard';

  @IsOptional()
  @IsNumber()
  company_id?: number;

  @IsOptional()
  @IsNumber()
  project_id?: number;
}