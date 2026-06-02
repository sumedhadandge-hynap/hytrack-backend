import { Module }
    from '@nestjs/common';

import { DatabaseModule }
    from 'src/database/database.module';

import { ProjectAppRecordsController }
    from './project-app-records.controller';

import { ProjectAppRecordsService }
    from './project-app-records.service';

@Module({
    imports: [
        DatabaseModule,
    ],

    controllers: [
        ProjectAppRecordsController,
    ],

    providers: [
        ProjectAppRecordsService,
    ],

    exports: [
        ProjectAppRecordsService,
    ],
})
export class ProjectAppRecordsModule { }