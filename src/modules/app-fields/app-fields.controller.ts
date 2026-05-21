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

import { AppFieldsService }
from './app-fields.service';

import { CreateAppFieldDto }
from './dto/create-app-field.dto';

import { UpdateAppFieldDto }
from './dto/update-app-field.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/app-fields')
export class AppFieldsController {

  constructor(
    private readonly appFieldsService: AppFieldsService,
  ) {}

  // CREATE
  @Post()
  async create(
    @Body() dto: CreateAppFieldDto,
    @Req() req: any,
  ) {

    const result =
      await this.appFieldsService.create(
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 201,
      message:
        'Field created successfully',
      result,
    };
  }

  // GET ALL
  @Get()
  async findAll() {

    const result =
      await this.appFieldsService.findAll();

    return {
      status: 'success',
      code: 200,
      message:
        'Fields fetched successfully',
      result,
    };
  }

  // GET BY APP
  @Get('app/:appId')
  async findByApp(
    @Param('appId', ParseIntPipe)
    appId: number,
  ) {

    const result =
      await this.appFieldsService.findByApp(
        appId,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'App fields fetched successfully',
      result,
    };
  }

  // GET ONE
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    const result =
      await this.appFieldsService.findOne(id);

    return {
      status: 'success',
      code: 200,
      message:
        'Field fetched successfully',
      result,
    };
  }

  // UPDATE
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateAppFieldDto,

    @Req()
    req: any,
  ) {

    const result =
      await this.appFieldsService.update(
        id,
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'Field updated successfully',
      result,
    };
  }

  // DELETE
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    await this.appFieldsService.remove(id);

    return {
      status: 'success',
      code: 200,
      message:
        'Field deleted successfully',
    };
  }
}