import {
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateStepDiscussionDto {

  @IsNumber()
  step_id!: number;

  @IsOptional()
  @IsNumber()
  role_id?: number;

  @IsOptional()
  @IsNumber()
  user_id?: number;
}