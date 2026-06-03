
import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import type { DbType }
    from 'src/database/database.module';
import { projectAppRecords } from 'src/database/schema/project_app_records';
import { CreateProjectAppRecordDto } from './dto/create-project-app-record.dto';
import { SaveProjectAppRecordDto } from './dto/save-project-app-record.dto';
import { projectAppRecordValues } from 'src/database/schema/project_app_record_values';
import { eq, and } from 'drizzle-orm';
import { ApproveProjectAppDto } from './dto/approve-project-app.dto';
import { projectAppApprovals } from 'src/database/schema/project_app_approvals';
import { projectApps } from 'src/database/schema/project-apps.schema';



@Injectable()
export class ProjectAppRecordsService {

    constructor(
        @Inject('DB')
        private readonly db: DbType,
    ) { }

    // Create Record
    async create(
        dto: CreateProjectAppRecordDto,
        userId?: number,
    ) {
        let projectId = dto.project_id;
        if (!projectId) {
            const projectApp = await this.db.query.projectApps.findFirst({
                where: eq(projectApps.id, dto.project_app_id),
            });
            if (!projectApp) {
                throw new NotFoundException('Project app not found');
            }
            projectId = projectApp.project_id;
        }

        let record = await this.db.query.projectAppRecords.findFirst({
            where: and(
                eq(projectAppRecords.project_app_id, dto.project_app_id),
                eq(projectAppRecords.status, 'draft'),
            ),
        });

        if (!record) {
            const [newRecord] = await this.db
                .insert(projectAppRecords)
                .values({
                    project_id: projectId,
                    project_app_id: dto.project_app_id,
                    status: 'draft',
                    started_by: userId,
                })
                .returning();
            record = newRecord;
        }

        if (dto.values && dto.values.length > 0) {
            await this.saveValues({
                record_id: record.id,
                values: dto.values,
            });
        }

        return record;
    }
    // Save Form Values
    async saveValues(
        dto: SaveProjectAppRecordDto,
    ) {
        await this.db
            .delete(projectAppRecordValues)
            .where(
                eq(
                    projectAppRecordValues.record_id,
                    dto.record_id,
                ),
            );

        if (!dto.values.length) {
            return [];
        }

        return await this.db
            .insert(projectAppRecordValues)
            .values(
                dto.values.map((v) => ({
                    record_id: dto.record_id,
                    field_id: v.field_id,
                    value: v.value,
                })),
            )
            .returning();
    }


    // Submit Record
    async submit(
        recordId: number,
    ) {
        const [record] =
            await this.db
                .update(projectAppRecords)
                .set({
                    status: 'submitted',
                    updated_at: new Date(),
                })
                .where(
                    eq(
                        projectAppRecords.id,
                        recordId,
                    ),
                )
                .returning();

        return record;
    }

    // Approve Step
    async approve(
        recordId: number,
        dto: ApproveProjectAppDto,
        userId?: number,
    ) {
        const [approval] =
            await this.db
                .insert(projectAppApprovals)
                .values({
                    record_id: recordId,
                    step_id: dto.step_id,
                    approved_by: userId,
                    status: dto.status,
                    remarks: dto.remarks,
                })
                .returning();

        return approval;
    }


    // Complete Record
    async complete(
        recordId: number,
    ) {
        const [record] =
            await this.db
                .update(projectAppRecords)
                .set({
                    status: 'completed',
                    updated_at: new Date(),
                })
                .where(
                    eq(
                        projectAppRecords.id,
                        recordId,
                    ),
                )
                .returning();

        return record;
    }


    async findOne(id: number) {

        const record =
            await this.db.query.projectAppRecords.findFirst({

                where: eq(
                    projectAppRecords.id,
                    id,
                ),

                with: {
                    values: true,
                    approvals: true,
                },
            });

        if (!record) {

            throw new NotFoundException(
                'Record not found',
            );
        }

        return record;
    }

    async findByProject(
        projectId: number,
    ) {

        return await this.db.query.projectAppRecords.findMany({

            where: eq(
                projectAppRecords.project_id,
                projectId,
            ),

            with: {
                values: true,
                approvals: true,
            },

            orderBy: (
                projectAppRecords,
                { desc },
            ) => [
                    desc(projectAppRecords.id),
                ],
        });
    }


}