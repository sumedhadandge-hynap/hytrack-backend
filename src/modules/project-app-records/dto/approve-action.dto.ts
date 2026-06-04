import { IsNumber, IsString, IsIn, IsOptional } from 'class-validator';

export class ApproveActionDto {
    @IsNumber()
    record_id: number;

    @IsString()
    @IsIn(['submit', 'approve', 'reject'])
    action: 'submit' | 'approve' | 'reject';

    @IsOptional()
    @IsString()
    remarks?: string;
}

