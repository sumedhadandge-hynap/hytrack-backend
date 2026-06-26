import { Module } from '@nestjs/common';
import { AppGroupsController } from './app-groups.controller';
import { AppGroupsService } from './app-groups.service';

@Module({
  controllers: [AppGroupsController],
  providers: [AppGroupsService],
})
export class AppGroupsModule {}