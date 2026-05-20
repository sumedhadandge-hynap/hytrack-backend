import { IsNumber, Min } from 'class-validator';

export class AssignRoleDto {
  @IsNumber()
  @Min(1)
  role_id!: number;
}