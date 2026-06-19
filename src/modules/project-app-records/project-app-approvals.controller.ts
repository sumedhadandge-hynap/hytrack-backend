import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
    from '../auth/guards/jwt-auth.guard';

import { ProjectAppRecordsService }
    from './project-app-records.service';

import { ApproveActionDto }
    from './dto/approve-action.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/project-app-approvals')
export class ProjectAppApprovalsController {

    constructor(
        private readonly projectAppRecordsService:
            ProjectAppRecordsService,
    ) { }

    @Post()
    async handleApproval(
        @Body()
        dto: ApproveActionDto,

        @Req()
        req: any,
    ) {
        const result =
            await this.projectAppRecordsService.handleApproval(
                dto,
                req.user?.id,
            );

        return {
            status: 'success',
            code: 201,
            message: `Record action ${dto.action} processed successfully`,
            result,
        };
    }
}
