import { IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class RecordValueDto {
    @IsNumber()
    field_id: number;

    @IsOptional()
    value: any;
}

export class CreateProjectAppRecordDto {
    @IsNumber()
    @IsOptional()
    project_id?: number;

    @IsNumber()
    project_app_id: number;

    @IsNumber()
    @IsOptional()
    step_id?: number;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => RecordValueDto)
    values?: RecordValueDto[];
}