import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateAppRecordValueDto {
  @IsNumber()
  record_id!: number;

  @IsNumber()
  field_id!: number;

  @IsNotEmpty()
  value!: any;
}