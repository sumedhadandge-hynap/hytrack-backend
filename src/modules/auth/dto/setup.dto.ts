import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
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

  @Matches(/^[0-9]{10}$/, {
    message: 'Phone must be 10 digits',
  })
  phone!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}