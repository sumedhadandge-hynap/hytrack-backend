import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    code!: string;

    @IsString()
    @IsNotEmpty()
    module!: string;

    @IsString()
    @IsOptional()
    description?: string;
}