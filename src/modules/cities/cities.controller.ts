// cities.controller.ts

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

import { CitiesService }
from './cities.service';

import { CreateCityDto }
from './dto/create-city.dto';

import { UpdateCityDto }
from './dto/update-city.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/cities')
export class CitiesController {

  constructor(
    private readonly citiesService:
      CitiesService,
  ) {}

  @Post()
  async create(
    @Body()
    dto: CreateCityDto,
  ) {

    const result =
      await this.citiesService.create(dto);

    return {
      status: 'success',
      code: 201,
      message:
        'City created successfully',
      result,
    };
  }

  @Get()
  async findAll() {

    const result =
      await this.citiesService.findAll();

    return {
      status: 'success',
      code: 200,
      message:
        'Cities fetched successfully',
      result,
    };
  }

  @Get('state/:stateId')
  async findByState(
    @Param(
      'stateId',
      ParseIntPipe,
    )
    stateId: number,
  ) {

    const result =
      await this.citiesService.findByState(
        stateId,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'Cities fetched successfully',
      result,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    const result =
      await this.citiesService.findOne(id);

    return {
      status: 'success',
      code: 200,
      message:
        'City fetched successfully',
      result,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateCityDto,
  ) {

    const result =
      await this.citiesService.update(
        id,
        dto,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'City updated successfully',
      result,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    await this.citiesService.remove(id);

    return {
      status: 'success',
      code: 200,
      message:
        'City deleted successfully',
    };
  }
}