
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

import { AppsService } from './apps.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';

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

  @Get('published/master')
  async getPublishedMasterApps() {
    const result =
      await this.appsService.getPublishedAppsByType(
        'master',
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
  async getPublishedStandardApps() {
    const result =
      await this.appsService.getPublishedAppsByType(
        'standard',
      );

    return {
      status: 'success',
      code: 200,
      message:
        'Published standard apps fetched successfully',
      result,
    };
  }
}