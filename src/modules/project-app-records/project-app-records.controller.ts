import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
    from '../auth/guards/jwt-auth.guard';

import { ProjectAppRecordsService }
    from './project-app-records.service';

import { CreateProjectAppRecordDto }
    from './dto/create-project-app-record.dto';

import { SaveProjectAppRecordDto }
    from './dto/save-project-app-record.dto';

import { ApproveProjectAppDto }
    from './dto/approve-project-app.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/project-app-records')
export class ProjectAppRecordsController {

    constructor(
        private readonly projectAppRecordsService:
            ProjectAppRecordsService,
    ) { }

    // START APP
    @Post()
    async create(
        @Body()
        dto: CreateProjectAppRecordDto,

        @Req()
        req: any,
    ) {

        const result =
            await this.projectAppRecordsService.create(
                dto,
                req.user?.id,
            );

        return {
            status: 'success',
            code: 201,
            message: 'App started successfully',
            result,
        };
    }

    // SAVE VALUES
    @Post('values')
    async saveValues(
        @Body()
        dto: SaveProjectAppRecordDto,
    ) {

        const result =
            await this.projectAppRecordsService.saveValues(
                dto,
            );

        return {
            status: 'success',
            code: 200,
            message: 'Values saved successfully',
            result,
        };
    }

    // SUBMIT
    @Post(':id/submit')
    async submit(
        @Param('id', ParseIntPipe)
        id: number,
    ) {

        const result =
            await this.projectAppRecordsService.submit(
                id,
            );

        return {
            status: 'success',
            code: 200,
            message: 'Record submitted successfully',
            result,
        };
    }

    // APPROVE
    @Post(':id/approve')
    async approve(
        @Param('id', ParseIntPipe)
        id: number,

        @Body()
        dto: ApproveProjectAppDto,

        @Req()
        req: any,
    ) {

        const result =
            await this.projectAppRecordsService.approve(
                id,
                dto,
                req.user?.id,
            );

        return {
            status: 'success',
            code: 200,
            message: 'Approval saved successfully',
            result,
        };
    }

    // COMPLETE
    @Post(':id/complete')
    async complete(
        @Param('id', ParseIntPipe)
        id: number,
    ) {

        const result =
            await this.projectAppRecordsService.complete(
                id,
            );

        return {
            status: 'success',
            code: 200,
            message: 'Record completed successfully',
            result,
        };
    }

    // GET SINGLE RECORD
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe)
        id: number,
    ) {

        const result =
            await this.projectAppRecordsService.findOne(
                id,
            );

        return {
            status: 'success',
            code: 200,
            message: 'Record fetched successfully',
            result,
        };
    }

    // GET PROJECT RECORDS
    @Get('project/:projectId')
    async findByProject(
        @Param('projectId', ParseIntPipe)
        projectId: number,
    ) {

        const result =
            await this.projectAppRecordsService.findByProject(
                projectId,
            );

        return {
            status: 'success',
            code: 200,
            message: 'Project records fetched successfully',
            result,
        };
    }
}