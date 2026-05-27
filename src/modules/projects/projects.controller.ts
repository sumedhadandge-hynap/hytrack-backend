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

import { ProjectsService }
from './projects.service';

import { CreateProjectDto }
from './dto/create-project.dto';

import { UpdateProjectDto }
from './dto/update-project.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/projects')
export class ProjectsController {
  constructor(
    private readonly projectsService:
      ProjectsService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateProjectDto,
    @Req() req: any,
  ) {
    const result =
      await this.projectsService.create(
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 201,
      message: 'Project created successfully',
      result,
    };
  }

  @Get()
  async findAll() {
    const result =
      await this.projectsService.findAll();

    return {
      status: 'success',
      code: 200,
      message: 'Projects fetched successfully',
      result,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    const result =
      await this.projectsService.findOne(id);

    return {
      status: 'success',
      code: 200,
      message: 'Project fetched successfully',
      result,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body() dto: UpdateProjectDto,
    @Req() req: any,
  ) {
    const result =
      await this.projectsService.update(
        id,
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 200,
      message: 'Project updated successfully',
      result,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    await this.projectsService.remove(id);

    return {
      status: 'success',
      code: 200,
      message: 'Project deleted successfully',
    };
  }
}