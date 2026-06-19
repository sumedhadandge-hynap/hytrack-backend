import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq } from 'drizzle-orm';

import type { DbType }
from 'src/database/database.module';

import {
  projectMembers,
  projects,
  users,
} from 'src/database/schema';

import { CreateProjectMemberDto }
from './dto/create-project-member.dto';

@Injectable()
export class ProjectMembersService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async add(dto: CreateProjectMemberDto) {
    const project =
      await this.db.query.projects.findFirst({
        where: eq(projects.id, dto.project_id),
      });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const user =
      await this.db.query.users.findFirst({
        where: eq(users.id, dto.user_id),
      });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing =
      await this.db.query.projectMembers.findFirst({
        where: and(
          eq(projectMembers.project_id, dto.project_id),
          eq(projectMembers.user_id, dto.user_id),
        ),
      });

    if (existing) {
      throw new BadRequestException(
        'User already added to project',
      );
    }

    const [member] =
      await this.db
        .insert(projectMembers)
        .values({
          project_id: dto.project_id,
          user_id: dto.user_id,
          role_name: dto.role_name ?? 'Member',
        })
        .returning();

    return member;
  }

  async findByProject(projectId: number) {
    return await this.db.query.projectMembers.findMany({
      where: eq(projectMembers.project_id, projectId),
      with: {
        user: true,
      },
    });
  }

  async remove(id: number) {
    await this.db
      .delete(projectMembers)
      .where(eq(projectMembers.id, id));

    return true;
  }
}