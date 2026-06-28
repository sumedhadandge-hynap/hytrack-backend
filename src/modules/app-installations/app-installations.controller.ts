import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppInstallationsService } from './app-installations.service';
import { InstallAppDto } from './dto/install-app.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/app-installations')
export class AppInstallationsController {
  constructor(
    private readonly appInstallationsService:
      AppInstallationsService,
  ) {}

  @Post('install-latest')
  async installLatest(
    @Body() dto: InstallAppDto,
    @Req() req: any,
  ) {
    const result =
      await this.appInstallationsService.installLatest(
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 201,
      message:
        'Latest app version installed successfully',
      result,
    };
  }

  @Post('update-latest')
  async updateLatest(
    @Body() dto: InstallAppDto,
    @Req() req: any,
  ) {
    const result =
      await this.appInstallationsService.installLatest(
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'App updated to latest version successfully',
      result,
    };
  }
}