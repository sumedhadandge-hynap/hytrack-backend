import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProjectMemberDto {
  @IsNumber()
  project_id!: number;

  @IsNumber()
  user_id!: number;

  @IsOptional()
  @IsString()
  role_name?: string;
}