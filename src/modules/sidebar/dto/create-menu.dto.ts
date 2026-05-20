import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateMenuDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    route!: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsNumber()
    @IsOptional()
    parent_id?: number;

    @IsNumber()
    @IsOptional()
    order_index?: number;

    @IsBoolean()
    @IsOptional()
    is_visible?: boolean;

    @IsString()
    @IsOptional()
    permission_code?: string;
}