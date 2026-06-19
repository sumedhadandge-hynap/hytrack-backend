// states.service.ts

import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { eq }
from 'drizzle-orm';

import type { DbType }
from 'src/database/database.module';

import {
  countries,
  states,
} from 'src/database/schema';

import { CreateStateDto }
from './dto/create-state.dto';

import { UpdateStateDto }
from './dto/update-state.dto';

@Injectable()
export class StatesService {

  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async create(
    dto: CreateStateDto,
  ) {

    const country =
      await this.db.query.countries.findFirst({

        where: eq(
          countries.id,
          dto.country_id,
        ),
      });

    if (!country) {

      throw new NotFoundException(
        'Country not found',
      );
    }

    const [state] =
      await this.db
        .insert(states)
        .values(dto)
        .returning();

    return state;
  }

  async findAll() {

    return await this.db.query.states.findMany({

      with: {
        country: true,
      },
    });
  }

  async findOne(id: number) {

    const state =
      await this.db.query.states.findFirst({

        where: eq(states.id, id),

        with: {
          country: true,
        },
      });

    if (!state) {

      throw new NotFoundException(
        'State not found',
      );
    }

    return state;
  }

  async findByCountry(
    countryId: number,
  ) {

    return await this.db.query.states.findMany({

      where: eq(
        states.country_id,
        countryId,
      ),
    });
  }

  async update(
    id: number,
    dto: UpdateStateDto,
  ) {

    await this.findOne(id);

    const [state] =
      await this.db
        .update(states)
        .set(dto)
        .where(
          eq(states.id, id),
        )
        .returning();

    return state;
  }

  async remove(id: number) {

    await this.findOne(id);

    await this.db
      .delete(states)
      .where(
        eq(states.id, id),
      );

    return true;
  }
}