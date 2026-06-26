import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';



import { AppGroupsService } from './app-groups.service';

import { CreateAppGroupDto } from './dto/create-app-group.dto';
import { UpdateAppGroupDto } from './dto/update-app-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
    const result = await this.appGroupsService.create(
      dto,
      req.user?.id,
    );

    return {
      status: 'success',
      code: 201,
      message: 'App group created successfully.',
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
      message: 'App groups fetched successfully.',
      result,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    const result =
      await this.appGroupsService.findOne(id);

    return {
      status: 'success',
      code: 200,
      message: 'App group fetched successfully.',
      result,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateAppGroupDto,

    @Req()
    req: any,
  ) {
    const result =
      await this.appGroupsService.update(
        id,
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 200,
      message: 'App group updated successfully.',
      result,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    await this.appGroupsService.remove(id);

    return {
      status: 'success',
      code: 200,
      message: 'App group deleted successfully.',
    };
  }

  @Get(':id/apps')
  async getApps(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    const result =
      await this.appGroupsService.getApps(id);

    return {
      status: 'success',
      code: 200,
      message: 'Apps fetched successfully.',
      result,
    };
  }
}