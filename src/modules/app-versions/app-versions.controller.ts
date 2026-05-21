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

import { JwtAuthGuard }
from '../auth/guards/jwt-auth.guard';

import { AppVersionsService }
from './app-versions.service';

import { CreateAppVersionDto }
from './dto/create-app-version.dto';

import { UpdateAppVersionDto }
from './dto/update-app-version.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/app-versions')
export class AppVersionsController {

  constructor(
    private readonly appVersionsService:
      AppVersionsService,
  ) {}

  // CREATE
  @Post()
  async create(
    @Body()
    dto: CreateAppVersionDto,

    @Req()
    req: any,
  ) {

    const result =
      await this.appVersionsService.create(
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 201,
      message:
        'Version created successfully',
      result,
    };
  }

  // GET ALL
  @Get()
  async findAll() {

    const result =
      await this.appVersionsService.findAll();

    return {
      status: 'success',
      code: 200,
      message:
        'Versions fetched successfully',
      result,
    };
  }

  // GET BY APP
  @Get('app/:appId')
  async findByApp(
    @Param(
      'appId',
      ParseIntPipe,
    )
    appId: number,
  ) {

    const result =
      await this.appVersionsService.findByApp(
        appId,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'Versions fetched successfully',
      result,
    };
  }

  // GET ONE
  @Get(':id')
  async findOne(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {

    const result =
      await this.appVersionsService.findOne(
        id,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'Version fetched successfully',
      result,
    };
  }

  // UPDATE
  @Put(':id')
  async update(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: UpdateAppVersionDto,

    @Req()
    req: any,
  ) {

    const result =
      await this.appVersionsService.update(
        id,
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'Version updated successfully',
      result,
    };
  }

  // PUBLISH
  @Post(':id/publish')
  async publish(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Req()
    req: any,
  ) {

    const result =
      await this.appVersionsService.publish(
        id,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'Version published successfully',
      result,
    };
  }

  // DELETE
  @Delete(':id')
  async remove(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {

    await this.appVersionsService.remove(
      id,
    );

    return {
      status: 'success',
      code: 200,
      message:
        'Version deleted successfully',
    };
  }
}