import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { desc, eq, or } from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import { countries } from 'src/database/schema';

import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountriesService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

async create(dto: CreateCountryDto) {
  const existingCountry =
    await this.db.query.countries.findFirst({
      where: or(
        eq(countries.name, dto.name),
        eq(countries.isoCode, dto.isoCode),
      ),
    });

  if (existingCountry) {
    if (existingCountry.name === dto.name) {
      throw new BadRequestException(
        'Country name already exists',
      );
    }

    throw new BadRequestException(
      'Country ISO code already exists',
    );
  }

  const [country] = await this.db
    .insert(countries)
    .values(dto)
    .returning();

  return country;
}

  async findAll() {
    return await this.db.query.countries.findMany({
      orderBy: (countries, { desc }) => [
        desc(countries.id),
      ],
    });
  }

  async findOne(id: number) {
    const country =
      await this.db.query.countries.findFirst({
        where: eq(countries.id, id),
      });

    if (!country) {
      throw new NotFoundException(
        'Country not found',
      );
    }

    return country;
  }

  async update(
    id: number,
    dto: UpdateCountryDto,
  ) {
    await this.findOne(id);

    const [country] = await this.db
      .update(countries)
      .set(dto)
      .where(eq(countries.id, id))
      .returning();

    return country;
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.db
      .delete(countries)
      .where(eq(countries.id, id));

    return true;
  }
}