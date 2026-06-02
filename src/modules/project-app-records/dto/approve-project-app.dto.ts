export class ApproveProjectAppDto {
    step_id: number;

    status: 'approved' | 'rejected';

    remarks?: string;
}