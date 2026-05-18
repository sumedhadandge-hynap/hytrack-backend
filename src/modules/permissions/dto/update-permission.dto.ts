import {
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdatePermissionDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    code?: string;

    @IsString()
    @IsOptional()
    module?: string;

    @IsString()
    @IsOptional()
    description?: string;
}