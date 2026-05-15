import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';

export class SetupDto {

    @IsString()
    @IsNotEmpty()
    company_name!: string;

    @IsString()
    @IsNotEmpty()
    first_name!: string;

    @IsString()
    @IsNotEmpty()
    last_name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    phone!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}