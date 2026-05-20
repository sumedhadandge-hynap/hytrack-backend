import { Module } from '@nestjs/common';

import { SidebarController } from './sidebar.controller';
import { SidebarService } from './sidebar.service';

@Module({
  controllers: [SidebarController],
  providers: [SidebarService],
  exports: [SidebarService],
})
export class SidebarModule {}