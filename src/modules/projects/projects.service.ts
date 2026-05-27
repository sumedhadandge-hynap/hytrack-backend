import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { desc, eq } from 'drizzle-orm';

import type { DbType }
from 'src/database/database.module';

import {
  companies,
  projects,
} from 'src/database/schema';

import { CreateProjectDto }
from './dto/create-project.dto';

import { UpdateProjectDto }
from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async create(
    dto: CreateProjectDto,
    userId?: number,
  ) {
    const company =
      await this.db.query.companies.findFirst({
        where: eq(
          companies.id,
          dto.company_id,
        ),
      });

    if (!company) {
      throw new NotFoundException(
        'Company not found',
      );
    }

    const [project] =
      await this.db
        .insert(projects)
        .values({
          company_id: dto.company_id,
          name: dto.name,
          description: dto.description ?? null,
          thumbnail_url: dto.thumbnail_url ?? null,
          start_date: dto.start_date
            ? new Date(dto.start_date)
            : null,
          end_date: dto.end_date
            ? new Date(dto.end_date)
            : null,
          country_id: dto.country_id ?? null,
          state_id: dto.state_id ?? null,
          city_id: dto.city_id ?? null,
          status: dto.status ?? 'draft',
          created_by: userId ?? null,
          updated_by: userId ?? null,
        })
        .returning();

    return project;
  }

  async findAll() {
    return await this.db.query.projects.findMany({
      orderBy: (projects, { desc }) => [
        desc(projects.id),
      ],
    });
  }

  async findOne(id: number) {
    const project =
      await this.db.query.projects.findFirst({
        where: eq(projects.id, id),
      });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    return project;
  }

  async update(
    id: number,
    dto: UpdateProjectDto,
    userId?: number,
  ) {
    await this.findOne(id);

    const [project] =
      await this.db
        .update(projects)
        .set({
          ...dto,
          start_date: dto.start_date
            ? new Date(dto.start_date)
            : undefined,
          end_date: dto.end_date
            ? new Date(dto.end_date)
            : undefined,
          updated_by: userId ?? null,
          updated_at: new Date(),
        })
        .where(eq(projects.id, id))
        .returning();

    return project;
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.db
      .delete(projects)
      .where(eq(projects.id, id));

    return true;
  }
}