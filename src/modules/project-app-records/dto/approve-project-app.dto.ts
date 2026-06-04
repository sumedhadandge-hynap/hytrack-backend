import { IsNumber, IsString, IsIn, IsOptional } from 'class-validator';

export class ApproveProjectAppDto {
    @IsNumber()
    step_id: number;

    @IsString()
    @IsIn(['approved', 'rejected'])
    status: 'approved' | 'rejected';

    @IsOptional()
    @IsString()
    remarks?: string;
}