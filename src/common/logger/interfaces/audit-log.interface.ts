export interface AuditLogData {
  user_id?: number;
  action: string;
  module: string;
  payload?: any;
}