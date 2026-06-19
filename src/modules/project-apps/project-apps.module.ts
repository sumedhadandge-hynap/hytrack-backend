import { Module } from '@nestjs/common';

import { ProjectAppsController } from './project-apps.controller';
import { ProjectAppsService } from './project-apps.service';

@Module({
  controllers: [ProjectAppsController],
  providers: [ProjectAppsService],
  exports: [ProjectAppsService],
})
export class ProjectAppsModule {}