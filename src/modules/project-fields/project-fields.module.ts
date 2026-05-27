import { Module } from '@nestjs/common';

import { ProjectFieldsController } from './project-fields.controller';
import { ProjectFieldsService } from './project-fields.service';

@Module({
  controllers: [ProjectFieldsController],
  providers: [ProjectFieldsService],
  exports: [ProjectFieldsService],
})
export class ProjectFieldsModule {}