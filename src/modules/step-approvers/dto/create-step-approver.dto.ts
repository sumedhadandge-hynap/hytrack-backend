import {
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateStepApproverDto {

  @IsNumber()
  step_id!: number;

  @IsOptional()
  @IsNumber()
  role_id?: number;

  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsOptional()
  @IsNumber()
  approval_level?: number;
}