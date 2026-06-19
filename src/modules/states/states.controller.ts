// states.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
from '../auth/guards/jwt-auth.guard';

import { StatesService }
from './states.service';

import { CreateStateDto }
from './dto/create-state.dto';

import { UpdateStateDto }
from './dto/update-state.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/states')
export class StatesController {

  constructor(
    private readonly statesService:
      StatesService,
  ) {}

  @Post()
  async create(
    @Body()
    dto: CreateStateDto,
  ) {

    const result =
      await this.statesService.create(dto);

    return {
      status: 'success',
      code: 201,
      message:
        'State created successfully',
      result,
    };
  }

  @Get()
  async findAll() {

    const result =
      await this.statesService.findAll();

    return {
      status: 'success',
      code: 200,
      message:
        'States fetched successfully',
      result,
    };
  }

  @Get('country/:countryId')
  async findByCountry(
    @Param(
      'countryId',
      ParseIntPipe,
    )
    countryId: number,
  ) {

    const result =
      await this.statesService.findByCountry(
        countryId,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'States fetched successfully',
      result,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    const result =
      await this.statesService.findOne(id);

    return {
      status: 'success',
      code: 200,
      message:
        'State fetched successfully',
      result,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateStateDto,
  ) {

    const result =
      await this.statesService.update(
        id,
        dto,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'State updated successfully',
      result,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    await this.statesService.remove(id);

    return {
      status: 'success',
      code: 200,
      message:
        'State deleted successfully',
    };
  }
}