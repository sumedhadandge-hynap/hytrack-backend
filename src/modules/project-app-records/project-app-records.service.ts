import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { DbType } from 'src/database/database.module';

import {
  and,
  desc,
  eq,
  inArray,
} from 'drizzle-orm';

import { projectAppRecords } from 'src/database/schema/project_app_records';
import { projectAppRecordValues } from 'src/database/schema/project_app_record_values';
import { projectAppApprovals } from 'src/database/schema/project_app_approvals';
import { projectApps } from 'src/database/schema/project-apps.schema';

import { appFields } from 'src/database/schema/app-fields.schema';
import { appVersions } from 'src/database/schema/app-versions.schema';
import { appSteps } from 'src/database/schema';

import { CreateProjectAppRecordDto } from './dto/create-project-app-record.dto';
import { SaveProjectAppRecordDto } from './dto/save-project-app-record.dto';
import { CreateProjectAppRecordValueDto } from './dto/create-project-app-record-value.dto';
import { ApproveProjectAppDto } from './dto/approve-project-app.dto';
import { ApproveActionDto } from './dto/approve-action.dto';

@Injectable()
export class ProjectAppRecordsService {
  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) {}

  private async getProjectAppOrThrow(projectAppId: number) {
    const projectApp =
      await this.db.query.projectApps.findFirst({
        where: eq(projectApps.id, projectAppId),
      });

    if (!projectApp) {
      throw new NotFoundException('Project app not found');
    }

    if (!projectApp.version_id) {
      throw new BadRequestException(
        'Project app has no installed version.',
      );
    }

    return projectApp;
  }

  private async getVersionOrThrow(versionId: number) {
    const version =
      await this.db.query.appVersions.findFirst({
        where: eq(appVersions.id, versionId),
      });

    if (!version) {
      throw new NotFoundException('App version not found');
    }

    return version;
  }

  async getVersionStepsAndFields(versionId: number) {
    const steps =
      await this.db.query.appSteps.findMany({
        where: eq(appSteps.version_id, versionId),
        orderBy: (appSteps, { asc }) => [
          asc(appSteps.order_index),
        ],
      });

    const stepIds = steps.map((step) => step.id);

    const fields = stepIds.length
      ? await this.db.query.appFields.findMany({
          where: inArray(appFields.step_id, stepIds),
          orderBy: (appFields, { asc }) => [
            asc(appFields.order_index),
          ],
        })
      : [];

    return {
      steps,
      fields,
    };
  }

  private async normalizeValuesForVersion(
    versionId: number,
    values: any[] = [],
  ) {
    const { fields } =
      await this.getVersionStepsAndFields(versionId);

    if (!fields.length && values.length) {
      throw new BadRequestException(
        'This installed version has no configured fields.',
      );
    }

    const normalized = values.map((item) => {
      if (item.field_id) {
        const field = fields.find(
          (field) => field.id === item.field_id,
        );

        if (!field) {
          throw new BadRequestException({
            message:
              'Field does not belong to this record version.',
            invalidField: item,
            validFields: fields.map((field) => ({
              id: field.id,
              label: field.label,
              field_key: field.field_key,
            })),
          });
        }

        return {
          field_id: field.id,
          value: item.value,
        };
      }

      if (item.field_key) {
        const field = fields.find(
          (field) => field.field_key === item.field_key,
        );

        if (!field) {
          throw new BadRequestException({
            message:
              'Field key does not belong to this record version.',
            invalidField: item,
            validFields: fields.map((field) => ({
              id: field.id,
              label: field.label,
              field_key: field.field_key,
            })),
          });
        }

        return {
          field_id: field.id,
          value: item.value,
        };
      }

      throw new BadRequestException(
        'Each value must have either field_id or field_key.',
      );
    });

    const uniqueMap = new Map<number, any>();

    for (const item of normalized) {
      uniqueMap.set(item.field_id, item);
    }

    return Array.from(uniqueMap.values());
  }

  async getSchema(projectAppId: number) {
    const projectApp =
      await this.getProjectAppOrThrow(projectAppId);

    const version =
      await this.getVersionOrThrow(projectApp.version_id!);

    const { steps, fields } =
      await this.getVersionStepsAndFields(version.id);

    return {
      project_id: projectApp.project_id,
      project_app_id: projectApp.id,
      app_id: projectApp.app_id,

      installed_version_id: version.id,
      installed_version_name: version.version_name,
      installed_version_number: version.version_number,

      steps: steps.map((step) => ({
        ...step,
        fields: fields.filter(
          (field) => field.step_id === step.id,
        ),
      })),
    };
  }

  async create(
    dto: CreateProjectAppRecordDto,
    userId?: number,
  ) {
    const projectApp =
      await this.getProjectAppOrThrow(dto.project_app_id);

    const { steps } =
      await this.getVersionStepsAndFields(
        projectApp.version_id!,
      );

    if (!steps.length) {
      throw new BadRequestException(
        'This installed version has no configured steps.',
      );
    }

    const normalizedValues =
      await this.normalizeValuesForVersion(
        projectApp.version_id!,
        dto.values ?? [],
      );

    const result =
      await this.db.transaction(async (tx) => {
        const [record] =
          await tx
            .insert(projectAppRecords)
            .values({
              project_id: projectApp.project_id,
              project_app_id: projectApp.id,
              version_id: projectApp.version_id!,
              status: (dto as any).status ?? 'draft',
              started_by: userId ?? null,
            })
            .returning();

        if (normalizedValues.length) {
          await tx
            .insert(projectAppRecordValues)
            .values(
              normalizedValues.map((item) => ({
                record_id: record.id,
                field_id: item.field_id,
                value: item.value,
              })),
            );
        }

        return record;
      });

    const version =
      await this.getVersionOrThrow(projectApp.version_id!);

    return {
      ...result,
      version: {
        id: version.id,
        version_name: version.version_name,
        version_number: version.version_number,
      },
    };
  }

  async saveValues(dto: SaveProjectAppRecordDto) {
    const record =
      await this.db.query.projectAppRecords.findFirst({
        where: eq(projectAppRecords.id, dto.record_id),
      });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    const normalizedValues =
      await this.normalizeValuesForVersion(
        record.version_id,
        dto.values ?? [],
      );

    await this.db
      .delete(projectAppRecordValues)
      .where(
        eq(
          projectAppRecordValues.record_id,
          dto.record_id,
        ),
      );

    if (!normalizedValues.length) {
      return [];
    }

    return await this.db
      .insert(projectAppRecordValues)
      .values(
        normalizedValues.map((item) => ({
          record_id: dto.record_id,
          field_id: item.field_id,
          value: item.value,
        })),
      )
      .returning();
  }

  async saveSingleValue(
    dto: CreateProjectAppRecordValueDto,
  ) {
    const record =
      await this.db.query.projectAppRecords.findFirst({
        where: eq(
          projectAppRecords.id,
          dto.record_id,
        ),
      });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    await this.normalizeValuesForVersion(
      record.version_id,
      [
        {
          field_id: dto.field_id,
          value: dto.value,
        },
      ],
    );

    const existing =
      await this.db.query.projectAppRecordValues.findFirst({
        where: and(
          eq(
            projectAppRecordValues.record_id,
            dto.record_id,
          ),
          eq(
            projectAppRecordValues.field_id,
            dto.field_id,
          ),
        ),
      });

    if (existing) {
      const [updated] =
        await this.db
          .update(projectAppRecordValues)
          .set({
            value: dto.value,
            updated_at: new Date(),
          })
          .where(
            eq(
              projectAppRecordValues.id,
              existing.id,
            ),
          )
          .returning();

      return updated;
    }

    const [inserted] =
      await this.db
        .insert(projectAppRecordValues)
        .values({
          record_id: dto.record_id,
          field_id: dto.field_id,
          value: dto.value,
        })
        .returning();

    return inserted;
  }

  private async updateRecordStatus(
    recordId: number,
    status: string,
  ) {
    const [record] =
      await this.db
        .update(projectAppRecords)
        .set({
          status,
          updated_at: new Date(),
        })
        .where(eq(projectAppRecords.id, recordId))
        .returning();

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    return record;
  }

  async submit(recordId: number) {
    return await this.updateRecordStatus(
      recordId,
      'submitted',
    );
  }

  async complete(recordId: number) {
    return await this.updateRecordStatus(
      recordId,
      'completed',
    );
  }

  async approve(
    recordId: number,
    dto: ApproveProjectAppDto,
    userId?: number,
  ) {
    const record =
      await this.db.query.projectAppRecords.findFirst({
        where: eq(projectAppRecords.id, recordId),
      });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    const { steps } =
      await this.getVersionStepsAndFields(
        record.version_id,
      );

    const stepExists = steps.some(
      (step) => step.id === dto.step_id,
    );

    if (!stepExists) {
      throw new BadRequestException(
        'Approval step does not belong to this record version.',
      );
    }

    const [approval] =
      await this.db
        .insert(projectAppApprovals)
        .values({
          record_id: recordId,
          step_id: dto.step_id,
          approved_by: userId ?? null,
          status: dto.status,
          remarks: dto.remarks ?? null,
        })
        .returning();

    return approval;
  }

  async findOne(id: number) {
    const record =
      await this.db.query.projectAppRecords.findFirst({
        where: eq(projectAppRecords.id, id),
        with: {
          values: true,
          approvals: true,
        },
      });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    const version =
      await this.getVersionOrThrow(record.version_id);

    const { steps, fields } =
      await this.getVersionStepsAndFields(
        record.version_id,
      );

    return {
      record,
      version,
      steps: steps.map((step) => ({
        ...step,
        fields: fields
          .filter(
            (field) => field.step_id === step.id,
          )
          .map((field) => ({
            ...field,
            value:
              record.values?.find(
                (value: any) =>
                  value.field_id === field.id,
              )?.value ?? null,
          })),
      })),
    };
  }

  private async enrichRecordList(records: any[]) {
    if (!records.length) {
      return [];
    }

    const versionIds = [
      ...new Set(
        records
          .map((record) => record.version_id)
          .filter(Boolean),
      ),
    ];

    const fieldIds = [
      ...new Set(
        records.flatMap((record) =>
          (record.values ?? [])
            .map((value: any) => value.field_id)
            .filter(Boolean),
        ),
      ),
    ];

    const versions = versionIds.length
      ? await this.db.query.appVersions.findMany({
          where: inArray(appVersions.id, versionIds),
        })
      : [];

    const fields = fieldIds.length
      ? await this.db.query.appFields.findMany({
          where: inArray(appFields.id, fieldIds),
        })
      : [];

    return records.map((record) => {
      const version = versions.find(
        (item) => item.id === record.version_id,
      );

      const enrichedValues =
        record.values?.map((value: any) => {
          const field = fields.find(
            (item) => item.id === value.field_id,
          );

          return {
            id: value.id,
            record_id: value.record_id,
            field_id: value.field_id,
            field_key: field?.field_key ?? null,
            label: field?.label ?? null,
            field_type: field?.field_type ?? null,
            value: value.value,
            created_at: value.created_at,
            updated_at: value.updated_at,
          };
        }) ?? [];

      return {
        ...record,
        values: enrichedValues,

        version,
        version_name: version?.version_name ?? null,
        version_number: version?.version_number ?? null,

        display_value:
          enrichedValues
            .map((item) => item.value)
            .filter(
              (value) =>
                value !== null &&
                value !== undefined &&
                value !== '',
            )
            .join(', ') || `Record #${record.id}`,
      };
    });
  }

  async findByProject(projectId: number) {
    const records =
      await this.db.query.projectAppRecords.findMany({
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
        ) => [desc(projectAppRecords.id)],
      });

    return await this.enrichRecordList(records);
  }

  async findByProjectApp(projectAppId: number) {
    const records =
      await this.db.query.projectAppRecords.findMany({
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
        ) => [desc(projectAppRecords.id)],
      });

    return await this.enrichRecordList(records);
  }

  async handleApproval(
    dto: ApproveActionDto,
    userId?: number,
  ) {
    const { record_id, action, remarks } = dto;

    const record =
      await this.db.query.projectAppRecords.findFirst({
        where: eq(projectAppRecords.id, record_id),
      });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    const { steps } =
      await this.getVersionStepsAndFields(
        record.version_id,
      );

    if (!steps.length) {
      throw new NotFoundException(
        'No steps defined for this record version.',
      );
    }

    const approvalSteps = steps.filter(
      (step) => step.step_type === 'approval',
    );

    const existingApprovals =
      await this.db.query.projectAppApprovals.findMany({
        where: eq(
          projectAppApprovals.record_id,
          record_id,
        ),
      });

    if (action === 'submit') {
      await this.updateRecordStatus(
        record_id,
        'submitted',
      );

      const firstStep = steps[0];

      await this.db
        .insert(projectAppApprovals)
        .values({
          record_id,
          step_id: firstStep.id,
          approved_by: userId ?? null,
          status: 'submitted',
          remarks: remarks ?? 'Submitted',
        });

      return {
        status: 'submitted',
        record_id,
      };
    }

    let stepId: number;

    if (approvalSteps.length > 0) {
      const approvedStepIds = new Set(
        existingApprovals
          .filter(
            (approval) =>
              approval.status === 'approved' ||
              approval.status === 'approve',
          )
          .map((approval) => approval.step_id),
      );

      const pendingStep = approvalSteps.find(
        (step) => !approvedStepIds.has(step.id),
      );

      stepId =
        pendingStep?.id ??
        approvalSteps[approvalSteps.length - 1].id;
    } else {
      stepId = steps[0].id;
    }

    const nextStatus =
      action === 'approve'
        ? 'approved'
        : action === 'reject'
          ? 'rejected'
          : null;

    if (!nextStatus) {
      throw new BadRequestException(
        'Invalid approval action.',
      );
    }

    const [newApproval] =
      await this.db
        .insert(projectAppApprovals)
        .values({
          record_id,
          step_id: stepId,
          approved_by: userId ?? null,
          status: nextStatus,
          remarks:
            remarks ??
            (action === 'approve'
              ? 'Approved'
              : 'Rejected'),
        })
        .returning();

    if (action === 'reject') {
      await this.updateRecordStatus(
        record_id,
        'rejected',
      );

      return newApproval;
    }

    const approvedStepIdsAfter = new Set([
      ...existingApprovals
        .filter(
          (approval) =>
            approval.status === 'approved' ||
            approval.status === 'approve',
        )
        .map((approval) => approval.step_id),
      stepId,
    ]);

    const remainingPending = approvalSteps.filter(
      (step) => !approvedStepIdsAfter.has(step.id),
    );

    if (
      approvalSteps.length > 0 &&
      remainingPending.length === 0
    ) {
      await this.updateRecordStatus(
        record_id,
        'completed',
      );
    }

    return newApproval;
  }
}