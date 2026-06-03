import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
from '../auth/guards/jwt-auth.guard';

import { ProjectAppsService }
from './project-apps.service';

import { InstallProjectAppDto }
from './dto/install-project-app.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/project-apps')
export class ProjectAppsController {
  constructor(
    private readonly projectAppsService:
      ProjectAppsService,
  ) {}

  @Post()
  async installRoot(
    @Body() dto: InstallProjectAppDto,
    @Req() req: any,
  ) {
    const result =
      await this.projectAppsService.install(
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 201,
      message: 'App installed successfully',
      result,
    };
  }

  @Post('install')
  async install(
    @Body() dto: InstallProjectAppDto,
    @Req() req: any,
  ) {
    const result =
      await this.projectAppsService.install(
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 201,
      message: 'App installed successfully',
      result,
    };
  }

  @Get('project/:projectId')
  async findByProject(
    @Param('projectId', ParseIntPipe)
    projectId: number,
  ) {
    const result =
      await this.projectAppsService
        .findByProject(projectId);

    return {
      status: 'success',
      code: 200,
      message: 'Project apps fetched successfully',
      result,
    };
  }

  @Get(':id/steps')
  async findSteps(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    const result =
      await this.projectAppsService.findSteps(id);

    return {
      status: 'success',
      code: 200,
      message: 'Workflow steps fetched successfully',
      result,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.projectAppsService.remove(id);

    return {
      status: 'success',
      code: 200,
      message: 'Project app removed successfully',
    };
  }
}