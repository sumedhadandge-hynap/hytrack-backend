// cities.service.ts

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
  cities,
  states,
} from 'src/database/schema';

import { CreateCityDto }
from './dto/create-city.dto';

import { UpdateCityDto }
from './dto/update-city.dto';

@Injectable()
export class CitiesService {

  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async create(
    dto: CreateCityDto,
  ) {

    const state =
      await this.db.query.states.findFirst({

        where: eq(
          states.id,
          dto.state_id,
        ),
      });

    if (!state) {

      throw new NotFoundException(
        'State not found',
      );
    }

    const [city] =
      await this.db
        .insert(cities)
        .values(dto)
        .returning();

    return city;
  }

  async findAll() {

    return await this.db.query.cities.findMany({

      with: {
        state: true,
        country: true,
      },
    });
  }

  async findOne(id: number) {

    const city =
      await this.db.query.cities.findFirst({

        where: eq(cities.id, id),

        with: {
          state: true,
          country: true,
        },
      });

    if (!city) {

      throw new NotFoundException(
        'City not found',
      );
    }

    return city;
  }

  async findByState(
    stateId: number,
  ) {

    return await this.db.query.cities.findMany({

      where: eq(
        cities.state_id,
        stateId,
      ),
    });
  }

  async update(
    id: number,
    dto: UpdateCityDto,
  ) {

    await this.findOne(id);

    const [city] =
      await this.db
        .update(cities)
        .set(dto)
        .where(
          eq(cities.id, id),
        )
        .returning();

    return city;
  }

  async remove(id: number) {

    await this.findOne(id);

    await this.db
      .delete(cities)
      .where(
        eq(cities.id, id),
      );

    return true;
  }
}