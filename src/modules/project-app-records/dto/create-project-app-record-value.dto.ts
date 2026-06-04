import { IsNumber, IsOptional } from 'class-validator';

export class CreateProjectAppRecordValueDto {
    @IsNumber()
    record_id: number;

    @IsNumber()
    field_id: number;

    @IsOptional()
    value: any;
}

