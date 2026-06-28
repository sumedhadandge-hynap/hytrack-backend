
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AppsService } from './apps.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';

@UseGuards(JwtAuthGuard)
@UseGuards(JwtAuthGuard)
@Controller('api/apps')
export class AppsController {
  constructor(
    private readonly appsService: AppsService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateAppDto,
    @Req() req: any,
  ) {
    const result =
      await this.appsService.create(
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 201,
      message: 'App created successfully',
      result,
    };
  }

  @Get()
  async findAll() {
    const result =
      await this.appsService.findAll();

    return {
      status: 'success',
      code: 200,
      message: 'Apps fetched successfully',
      result,
    };
  }

@Get('published/master')
async getPublishedMasterApps(
  @Query('company_id') companyId?: string,
) {
  const result =
    await this.appsService.getPublishedAppsByType(
      'master',
      {
        company_id: companyId
          ? Number(companyId)
          : undefined,
      },
    );

  return {
    status: 'success',
    code: 200,
    message:
      'Published master apps fetched successfully',
    result,
  };
}

@Get('published/standard')
async getPublishedStandardApps(
  @Query('project_id') projectId?: string,
) {
  const result =
    await this.appsService.getPublishedAppsByType(
      'standard',
      {
        project_id: projectId
          ? Number(projectId)
          : undefined,
      },
    );

  return {
    status: 'success',
    code: 200,
    message:
      'Published standard apps fetched successfully',
    result,
  };
}

  @Get(':id/latest-published')
  async getLatestPublishedVersion(
    @Param('id', ParseIntPipe)
    id: number,

    @Query('current_version_id')
    currentVersionId?: string,
  ) {
    const result =
      await this.appsService.getLatestPublishedVersion(
        id,
        currentVersionId
          ? Number(currentVersionId)
          : undefined,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'Latest published version fetched successfully',
      result,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    const result =
      await this.appsService.findOne(id);

    return {
      status: 'success',
      code: 200,
      message: 'App fetched successfully',
      result,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateAppDto,

    @Req()
    req: any,
  ) {
    const result =
      await this.appsService.update(
        id,
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 200,
      message: 'App updated successfully',
      result,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    await this.appsService.remove(id);

    return {
      status: 'success',
      code: 200,
      message: 'App deleted successfully',
    };
  }
}