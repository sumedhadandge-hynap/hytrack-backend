// countries.controller.ts

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

import { CountriesService }
from './countries.service';

import { CreateCountryDto }
from './dto/create-country.dto';

import { UpdateCountryDto }
from './dto/update-country.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/countries')
export class CountriesController {

  constructor(
    private readonly countriesService:
      CountriesService,
  ) {}

  @Post()
  async create(
    @Body()
    dto: CreateCountryDto,
  ) {

    const result =
      await this.countriesService.create(dto);

    return {
      status: 'success',
      code: 201,
      message:
        'Country created successfully',
      result,
    };
  }

  @Get()
  async findAll() {

    const result =
      await this.countriesService.findAll();

    return {
      status: 'success',
      code: 200,
      message:
        'Countries fetched successfully',
      result,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    const result =
      await this.countriesService.findOne(id);

    return {
      status: 'success',
      code: 200,
      message:
        'Country fetched successfully',
      result,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateCountryDto,
  ) {

    const result =
      await this.countriesService.update(
        id,
        dto,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'Country updated successfully',
      result,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    await this.countriesService.remove(id);

    return {
      status: 'success',
      code: 200,
      message:
        'Country deleted successfully',
    };
  }
}