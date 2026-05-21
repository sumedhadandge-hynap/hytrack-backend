import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { eq }
from 'drizzle-orm';

import type { DbType }
from 'src/database/database.module';

import { stepDiscussions }
from 'src/database/schema';

import { CreateStepDiscussionDto }
from './dto/create-step-discussion.dto';

@Injectable()
export class StepDiscussionsService {

  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async create(dto: CreateStepDiscussionDto) {

    const [result] =
      await this.db
        .insert(stepDiscussions)
        .values({

          step_id: dto.step_id,

          role_id:
            dto.role_id ?? null,

          user_id:
            dto.user_id ?? null,
        })
        .returning();

    return result;
  }

  async findAll() {

    return await this.db.query.stepDiscussions.findMany({

      orderBy: (
        stepDiscussions,
        { desc },
      ) => [
        desc(stepDiscussions.id),
      ],
    });
  }

  async findByStep(stepId: number) {

    return await this.db.query.stepDiscussions.findMany({

      where: eq(
        stepDiscussions.step_id,
        stepId,
      ),
    });
  }
}