import {  BadRequestException,  Inject,  Injectable,  NotFoundException,} from '@nestjs/common';

import { eq } from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import { appTypes } from 'src/database/schema';

import { CreateAppTypeDto } from './dto/create-app-type.dto';

@Injectable()
export class AppTypesService {

  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}


//   Create a new app type
  async create(
    dto: CreateAppTypeDto,
    userId?: number,
  ) {

    const existing =
      await this.db.query.appTypes.findFirst({
        where: eq(appTypes.code, dto.code),
      });

    if (existing) {

      throw new BadRequestException(
        'App type code already exists',
      );
    }

    const [result] =
      await this.db
        .insert(appTypes)
        .values({

          name: dto.name,

          code: dto.code,

          description:
            dto.description ?? null,

          created_by: userId,

          updated_by: userId,
        })
        .returning();

    return result;
  }

  // Fetch all app types
  async findAll() {

    return await this.db.query.appTypes.findMany({
      orderBy: (appTypes, { desc }) => [
        desc(appTypes.id),
      ],
    });
  }

  // Fetch a single app type by ID
  async findOne(id: number) {

    const result =
      await this.db.query.appTypes.findFirst({
        where: eq(appTypes.id, id),
      });

    if (!result) {

      throw new NotFoundException(
        'App type not found',
      );
    }

    return result;
  }

// 

}