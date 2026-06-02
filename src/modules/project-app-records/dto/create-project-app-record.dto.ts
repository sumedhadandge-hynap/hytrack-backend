import { IsNumber } from 'class-validator';

export class CreateProjectAppRecordDto {
    @IsNumber()
    project_id: number;

    @IsNumber()
    project_app_id: number;
}