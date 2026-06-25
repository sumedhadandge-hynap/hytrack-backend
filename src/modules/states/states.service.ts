import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq, or } from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import {
  countries,
  states,
} from 'src/database/schema';

import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@Injectable()
export class StatesService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) { }

  async create(dto: CreateStateDto) {
    const country =
      await this.db.query.countries.findFirst({
        where: eq(
          countries.id,
          dto.countryId,
        ),
      });

    if (!country) {
      throw new NotFoundException(
        'Country not found',
      );
    }

    // Check duplicate state name
    const existingStateByName =
      await this.db.query.states.findFirst({
        where: and(
          eq(states.countryId, dto.countryId),
          eq(states.name, dto.name),
        ),
      });

    if (existingStateByName) {
      throw new BadRequestException(
        'State name already exists for this country',
      );
    }

    // Check duplicate state code (only if provided)
    if (dto.stateCode) {
      const existingStateByCode =
        await this.db.query.states.findFirst({
          where: and(
            eq(states.countryId, dto.countryId),
            eq(states.stateCode, dto.stateCode),
          ),
        });

      if (existingStateByCode) {
        throw new BadRequestException(
          'State code already exists for this country',
        );
      }
    }
    const [state] = await this.db
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
        states.countryId,
        countryId,
      ),
    });
  }

  async update(
    id: number,
    dto: UpdateStateDto,
  ) {
    await this.findOne(id);

    const [state] = await this.db
      .update(states)
      .set(dto)
      .where(eq(states.id, id))
      .returning();

    return state;
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.db
      .delete(states)
      .where(eq(states.id, id));

    return true;
  }
}