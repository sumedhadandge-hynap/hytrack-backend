import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { eq } from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import { permissions } from 'src/database/schema';

import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
    constructor(
        @Inject('DB')
        private readonly db: DbType,
    ) { }

    async create(dto: CreatePermissionDto, userId?: number) {
        const existing =
            await this.db.query.permissions.findFirst({
                where: eq(permissions.code, dto.code),
            });

        if (existing) {
            throw new BadRequestException(
                'Permission code already exists',
            );
        }

        const [permission] = await this.db
            .insert(permissions)
            .values({
                name: dto.name,
                code: dto.code,
                module: dto.module,
                description: dto.description ?? null,
                created_by: userId,
                updated_by: userId,
            })
            .returning();

        return permission;
    }

    async findAll() {
        return await this.db.query.permissions.findMany({
            orderBy: (permissions, { desc }) => [
                desc(permissions.id),
            ],
        });
    }

    async findOne(id: number) {
        const permission =
            await this.db.query.permissions.findFirst({
                where: eq(permissions.id, id),
            });

        if (!permission) {
            throw new NotFoundException(
                'Permission not found',
            );
        }

        return permission;
    }

    async update(
        id: number,
        dto: UpdatePermissionDto,
        userId?: number,
    ) {
        await this.findOne(id);

        const [permission] = await this.db
            .update(permissions)
            .set({
                ...dto,
                updated_by: userId,
                updated_at: new Date(),
            })
            .where(eq(permissions.id, id))
            .returning();

        return permission;
    }

    async remove(id: number) {
        await this.findOne(id);

        await this.db
            .delete(permissions)
            .where(eq(permissions.id, id));

        return true;
    }
}