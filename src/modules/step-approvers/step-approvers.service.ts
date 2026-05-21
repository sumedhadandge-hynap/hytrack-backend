import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { eq }
from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import { stepApprovers }
from 'src/database/schema';

import { CreateStepApproverDto }
from './dto/create-step-approver.dto';

@Injectable()
export class StepApproversService {

  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async create(dto: CreateStepApproverDto) {

    const [result] =
      await this.db
        .insert(stepApprovers)
        .values({

          step_id: dto.step_id,

          role_id:
            dto.role_id ?? null,

          user_id:
            dto.user_id ?? null,

          // approval_level:
          //   dto.approval_level ?? 1,
        })
        .returning();

    return result;
  }

  async findAll() {

    return await this.db.query.stepApprovers.findMany({

      orderBy: (
        stepApprovers,
        { desc },
      ) => [
        desc(stepApprovers.id),
      ],
    });
  }

  async findByStep(stepId: number) {

    return await this.db.query.stepApprovers.findMany({

      where: eq(
        stepApprovers.step_id,
        stepId,
      ),
    });
  }
}