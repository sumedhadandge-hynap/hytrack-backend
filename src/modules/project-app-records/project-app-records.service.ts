
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
import { CreateProjectAppRecordValueDto } from './dto/create-project-app-record-value.dto';
import { ApproveActionDto } from './dto/approve-action.dto';



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

    // Save single record value (upsert)
    async saveSingleValue(dto: CreateProjectAppRecordValueDto) {
        const existing = await this.db.query.projectAppRecordValues.findFirst({
            where: and(
                eq(projectAppRecordValues.record_id, dto.record_id),
                eq(projectAppRecordValues.field_id, dto.field_id),
            ),
        });

        if (existing) {
            const [updated] = await this.db
                .update(projectAppRecordValues)
                .set({
                    value: dto.value,
                    updated_at: new Date(),
                })
                .where(eq(projectAppRecordValues.id, existing.id))
                .returning();
            return updated;
        } else {
            const [inserted] = await this.db
                .insert(projectAppRecordValues)
                .values({
                    record_id: dto.record_id,
                    field_id: dto.field_id,
                    value: dto.value,
                })
                .returning();
            return inserted;
        }
    }

    // Handle Approval Action
    async handleApproval(
        dto: ApproveActionDto,
        userId?: number,
    ) {
        const { record_id, action, remarks } = dto;

        const record = await this.db.query.projectAppRecords.findFirst({
            where: eq(projectAppRecords.id, record_id),
        });

        if (!record) {
            throw new NotFoundException('Record not found');
        }

        // Get the project app to find the steps
        const projectApp = await this.db.query.projectApps.findFirst({
            where: eq(projectApps.id, record.project_app_id),
            with: {
                version: {
                    with: {
                        steps: true,
                    },
                },
            },
        });

        if (!projectApp || !projectApp.version) {
            throw new NotFoundException('Project app or app version details not found');
        }

        const steps = projectApp.version.steps.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
        const approvalSteps = steps.filter((s) => s.step_type === 'approval');

        let stepId: number;

        // Find existing approvals for this record
        const existingApprovals = await this.db.query.projectAppApprovals.findMany({
            where: eq(projectAppApprovals.record_id, record_id),
        });

        if (action === 'submit') {
            // Update record status to submitted
            await this.db
                .update(projectAppRecords)
                .set({
                    status: 'submitted',
                    updated_at: new Date(),
                })
                .where(eq(projectAppRecords.id, record_id));

            // Also insert approval event for submit
            if (steps.length > 0) {
                stepId = steps[0].id;
                await this.db
                    .insert(projectAppApprovals)
                    .values({
                        record_id,
                        step_id: stepId,
                        approved_by: userId,
                        status: 'submitted',
                        remarks: remarks ?? 'Submitted',
                    });
            }

            return {
                status: 'submitted',
                record_id,
            };
        }

        // For approve / reject, we find the current pending approval step
        if (approvalSteps.length > 0) {
            const approvedStepIds = new Set(
                existingApprovals
                    .filter((a) => a.status === 'approved' || a.status === 'approve')
                    .map((a) => a.step_id),
            );

            const pendingStep = approvalSteps.find((s) => !approvedStepIds.has(s.id));
            stepId = pendingStep ? pendingStep.id : approvalSteps[approvalSteps.length - 1].id;
        } else if (steps.length > 0) {
            stepId = steps[0].id;
        } else {
            throw new NotFoundException('No steps defined for this app');
        }

        // Insert new approval
        const [newApproval] = await this.db
            .insert(projectAppApprovals)
            .values({
                record_id,
                step_id: stepId,
                approved_by: userId,
                status: action === 'approve' ? 'approved' : 'rejected',
                remarks: remarks ?? (action === 'approve' ? 'Approved' : 'Rejected'),
            })
            .returning();

        if (action === 'approve') {
            // If all approval steps are completed, mark record as completed
            const approvedStepIdsAfter = new Set([
                ...existingApprovals
                    .filter((a) => a.status === 'approved' || a.status === 'approve')
                    .map((a) => a.step_id),
                stepId,
            ]);

            const remainingPending = approvalSteps.filter((s) => !approvedStepIdsAfter.has(s.id));
            if (remainingPending.length === 0) {
                await this.db
                    .update(projectAppRecords)
                    .set({
                        status: 'completed',
                        updated_at: new Date(),
                    })
                    .where(eq(projectAppRecords.id, record_id));
            }
        } else if (action === 'reject') {
            // Mark record status as rejected
            await this.db
                .update(projectAppRecords)
                .set({
                    status: 'rejected',
                    updated_at: new Date(),
                })
                .where(eq(projectAppRecords.id, record_id));
        }

        return newApproval;
    }









    async findByProjectApp(
        projectAppId: number,
    ) {

        return await this.db
            .query.projectAppRecords.findMany({

                where: eq(
                    projectAppRecords.project_app_id,
                    projectAppId,
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