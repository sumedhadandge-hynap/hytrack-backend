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

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppGroupsService } from './app-groups.service';
import { CreateAppGroupDto } from './dto/create-app-group.dto';
import { AddAppsToGroupDto } from './dto/add-apps-to-group.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/app-groups')
export class AppGroupsController {
  constructor(
    private readonly appGroupsService: AppGroupsService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateAppGroupDto,
    @Req() req: any,
  ) {
    const result =
      await this.appGroupsService.create(
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 201,
      message: 'App group created successfully',
      result,
    };
  }

  @Get()
  async findAll() {
    const result =
      await this.appGroupsService.findAll();

    return {
      status: 'success',
      code: 200,
      message: 'App groups fetched successfully',
      result,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result =
      await this.appGroupsService.findOne(id);

    return {
      status: 'success',
      code: 200,
      message: 'App group fetched successfully',
      result,
    };
  }

  @Post(':id/apps')
  async addAppsToGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddAppsToGroupDto,
    @Req() req: any,
  ) {
    const result =
      await this.appGroupsService.addAppsToGroup(
        id,
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 201,
      message: 'Apps added to group successfully',
      result,
    };
  }

  @Get(':id/apps')
  async getGroupApps(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result =
      await this.appGroupsService.getGroupApps(id);

    return {
      status: 'success',
      code: 200,
      message: 'App group apps fetched successfully',
      result,
    };
  }

  @Delete(':id/apps/:appId')
  async removeAppFromGroup(
    @Param('id', ParseIntPipe) id: number,
    @Param('appId', ParseIntPipe) appId: number,
  ) {
    const result =
      await this.appGroupsService.removeAppFromGroup(
        id,
        appId,
      );

    return {
      status: 'success',
      code: 200,
      message: 'App removed from group successfully',
      result,
    };
  }
}