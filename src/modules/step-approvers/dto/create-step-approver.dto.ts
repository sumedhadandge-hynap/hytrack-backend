import {
  IsNumber,
  IsOptional,
  IsString,
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


  @IsOptional()
  @IsString()
  approval_type?: string;

  @IsOptional()
  @IsString()
  rejection_action?: string;

  @IsOptional()
  @IsNumber()
  order_index?: number;
}