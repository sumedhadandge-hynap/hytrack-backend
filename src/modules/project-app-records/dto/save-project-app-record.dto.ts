export class SaveProjectAppRecordDto {
    record_id: number;

    values: {
        field_id: number;
        value: any;
    }[];
}