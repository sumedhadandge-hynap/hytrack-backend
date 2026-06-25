import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq, or } from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import {
  cities,
  countries,
  states,
} from 'src/database/schema';

import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CitiesService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

async create(dto: CreateCityDto) {
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

  const state =
    await this.db.query.states.findFirst({
      where: eq(
        states.id,
        dto.stateId,
      ),
    });

  if (!state) {
    throw new NotFoundException(
      'State not found',
    );
  }

  if (state.countryId !== dto.countryId) {
    throw new BadRequestException(
      'Selected state does not belong to the selected country',
    );
  }

  // Check duplicate city name in the same state
  const existingCityByName =
    await this.db.query.cities.findFirst({
      where: and(
        eq(cities.stateId, dto.stateId),
        eq(cities.name, dto.name),
      ),
    });

  if (existingCityByName) {
    throw new BadRequestException(
      'City name already exists for this state',
    );
  }

  // Check duplicate city code only if provided
  if (dto.code) {
    const existingCityByCode =
      await this.db.query.cities.findFirst({
        where: and(
          eq(cities.stateId, dto.stateId),
          eq(cities.code, dto.code),
        ),
      });

    if (existingCityByCode) {
      throw new BadRequestException(
        'City code already exists for this state',
      );
    }
  }

  const [city] = await this.db
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
        cities.stateId,
        stateId,
      ),
    });
  }

  async update(
    id: number,
    dto: UpdateCityDto,
  ) {
    await this.findOne(id);

    const [city] = await this.db
      .update(cities)
      .set(dto)
      .where(eq(cities.id, id))
      .returning();

    return city;
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.db
      .delete(cities)
      .where(eq(cities.id, id));

    return true;
  }
}