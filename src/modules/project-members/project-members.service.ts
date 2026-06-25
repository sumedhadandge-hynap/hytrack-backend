import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  and,
  desc,
  eq,
} from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import {
  projectMembers,
  projects,
  users,
} from 'src/database/schema';

import { CreateProjectMemberDto } from './dto/create-project-member.dto';

@Injectable()
export class ProjectMembersService {

  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  async add(
    dto: CreateProjectMemberDto,
    userId?: number,
  ) {

    const project =
      await this.db.query.projects.findFirst({
        where: eq(
          projects.id,
          dto.project_id,
        ),
      });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    const user =
      await this.db.query.users.findFirst({
        where: eq(
          users.id,
          dto.user_id,
        ),
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const existing =
      await this.db.query.projectMembers.findFirst({
        where: and(
          eq(
            projectMembers.project_id,
            dto.project_id,
          ),
          eq(
            projectMembers.user_id,
            dto.user_id,
          ),
        ),
      });

    if (existing) {
      throw new BadRequestException(
        'User is already assigned to this project',
      );
    }

    const [member] =
      await this.db
        .insert(projectMembers)
        .values({

          project_id: dto.project_id,

          user_id: dto.user_id,

          role_name:
            dto.role_name ?? 'Member',

          created_by: userId,

          updated_by: userId,
        })
        .returning();

    return member;
  }

  async findByProject(
    projectId: number,
  ) {

    const project =
      await this.db.query.projects.findFirst({
        where: eq(
          projects.id,
          projectId,
        ),
      });

    if (!project) {
      throw new NotFoundException(
        'Project not found',
      );
    }

    return await this.db.query.projectMembers.findMany({

      where: eq(
        projectMembers.project_id,
        projectId,
      ),

      with: {
        user: true,
      },

      orderBy: (
        projectMembers,
        { desc },
      ) => [
        desc(projectMembers.id),
      ],
    });
  }

  async remove(id: number) {

    const member =
      await this.db.query.projectMembers.findFirst({

        where: eq(
          projectMembers.id,
          id,
        ),
      });

    if (!member) {
      throw new NotFoundException(
        'Project member not found',
      );
    }

    await this.db
      .delete(projectMembers)
      .where(
        eq(
          projectMembers.id,
          id,
        ),
      );

    return true;
  }
}