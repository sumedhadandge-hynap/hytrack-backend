import {
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import type { DbType }
from 'src/database/database.module';

import { auditLogs }
from 'src/database/schema';

import type {
  AuditLogData,
} from './interfaces/audit-log.interface';

@Injectable()
export class LoggerService {

  private readonly logger =
    new Logger(LoggerService.name);

  constructor(

    @Inject('DB')
    private readonly db: DbType,
  ) {}

  // =====================================
  // SUCCESS LOG
  // =====================================

  success(message: string) {

    this.logger.log(message);
  }

  // =====================================
  // ERROR LOG
  // =====================================

  error(message: string, trace?: any) {

    this.logger.error(message, trace);
  }

  // =====================================
  // WARN LOG
  // =====================================

  warn(message: string) {

    this.logger.warn(message);
  }

  // =====================================
  // DEBUG LOG
  // =====================================

  debug(message: string) {

    this.logger.debug(message);
  }

  // =====================================
  // AUDIT LOG
  // =====================================

async audit(data: AuditLogData) {
  await this.db
    .insert(auditLogs)
    .values({
      user_id: data.user_id,
      action: data.action,
      module: data.module,
      payload: data.payload ?? null,
    });

  this.logger.log(`AUDIT: ${data.action}`);
}
}