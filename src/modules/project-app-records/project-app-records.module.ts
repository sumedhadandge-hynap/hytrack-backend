import { Module }
    from '@nestjs/common';

import { DatabaseModule }
    from 'src/database/database.module';

import { ProjectAppRecordsController }
    from './project-app-records.controller';
import { ProjectAppRecordValuesController }
    from './project-app-record-values.controller';
import { ProjectAppApprovalsController }
    from './project-app-approvals.controller';

import { ProjectAppRecordsService }
    from './project-app-records.service';

@Module({
    imports: [
        DatabaseModule,
    ],

    controllers: [
        ProjectAppRecordsController,
        ProjectAppRecordValuesController,
        ProjectAppApprovalsController,
    ],

    providers: [
        ProjectAppRecordsService,
    ],

    exports: [
        ProjectAppRecordsService,
    ],
})
export class ProjectAppRecordsModule { }