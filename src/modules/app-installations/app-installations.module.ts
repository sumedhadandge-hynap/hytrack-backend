import { Module } from '@nestjs/common';

import { AppInstallationsController } from './app-installations.controller';
import { AppInstallationsService } from './app-installations.service';

@Module({
  controllers: [AppInstallationsController],
  providers: [AppInstallationsService],
  exports: [AppInstallationsService],
})
export class AppInstallationsModule {}