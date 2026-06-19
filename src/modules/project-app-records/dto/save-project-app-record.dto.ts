import { IsNumber, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SaveValueDto {
    @IsNumber()
    field_id: number;

    @IsOptional()
    value: any;
}

export class SaveProjectAppRecordDto {
    @IsNumber()
    record_id: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SaveValueDto)
    values: SaveValueDto[];
}