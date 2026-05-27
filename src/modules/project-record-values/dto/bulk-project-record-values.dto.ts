import {
  IsArray,
  IsNumber,
} from 'class-validator';

export class BulkProjectRecordValuesDto {
  @IsNumber()
  project_id!: number;

  @IsArray()
  values!: {
    field_id: number;
    value: any;
  }[];
}