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

import { AppStepsService }
from './app-steps.service';

import { CreateAppStepDto }
from './dto/create-app-step.dto';

import { UpdateAppStepDto }
from './dto/update-app-step.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/app-steps')
export class AppStepsController {

  constructor(
    private readonly appStepsService: AppStepsService,
  ) {}

  // CREATE STEP
  @Post()
  async create(
    @Body() dto: CreateAppStepDto,
    @Req() req: any,
  ) {

    const result =
      await this.appStepsService.create(
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 201,
      message:
        'Step created successfully',
      result,
    };
  }

  // GET ALL STEPS
  @Get()
  async findAll() {

    const result =
      await this.appStepsService.findAll();

    return {
      status: 'success',
      code: 200,
      message:
        'Steps fetched successfully',
      result,
    };
  }

  // GET APP STEPS
  @Get('app/:appId')
  async findByApp(
    @Param('appId', ParseIntPipe)
    appId: number,
  ) {

    const result =
      await this.appStepsService.findByApp(
        appId,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'App steps fetched successfully',
      result,
    };
  }

  // GET STEP
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    const result =
      await this.appStepsService.findOne(id);

    return {
      status: 'success',
      code: 200,
      message:
        'Step fetched successfully',
      result,
    };
  }

  // UPDATE STEP
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateAppStepDto,

    @Req()
    req: any,
  ) {

    const result =
      await this.appStepsService.update(
        id,
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'Step updated successfully',
      result,
    };
  }

  // DELETE STEP
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    await this.appStepsService.remove(id);

    return {
      status: 'success',
      code: 200,
      message:
        'Step deleted successfully',
    };
  }
}