import { IsNumber, IsOptional, IsArray } from 'class-validator';

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
    values?: {
        field_id: number;
        value: any;
    }[];
}