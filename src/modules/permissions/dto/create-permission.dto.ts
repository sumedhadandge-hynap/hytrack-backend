import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z0-9_]+$/, {
    message: 'code must contain only lowercase letters, numbers and underscore',
  })
  code!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  module!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}