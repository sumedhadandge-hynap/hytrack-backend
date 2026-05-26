import {
  IsArray,
  IsNumber,
} from 'class-validator';

export class BulkAppRecordValuesDto {
  @IsNumber()
  record_id!: number;

  @IsArray()
  values!: {
    field_id: number;
    value: any;
  }[];
}