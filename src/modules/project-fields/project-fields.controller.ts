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

import { ProjectFieldsService }
from './project-fields.service';

import { CreateProjectFieldDto }
from './dto/create-project-field.dto';

import { UpdateProjectFieldDto }
from './dto/update-project-field.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/project-fields')
export class ProjectFieldsController {
  constructor(
    private readonly projectFieldsService:
      ProjectFieldsService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateProjectFieldDto,
    @Req() req: any,
  ) {
    const result =
      await this.projectFieldsService.create(
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 201,
      message: 'Project field created successfully',
      result,
    };
  }

  @Get('project/:projectId')
  async findByProject(
    @Param('projectId', ParseIntPipe)
    projectId: number,
  ) {
    const result =
      await this.projectFieldsService.findByProject(
        projectId,
      );

    return {
      status: 'success',
      code: 200,
      message: 'Project fields fetched successfully',
      result,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectFieldDto,
    @Req() req: any,
  ) {
    const result =
      await this.projectFieldsService.update(
        id,
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 200,
      message: 'Project field updated successfully',
      result,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.projectFieldsService.remove(id);

    return {
      status: 'success',
      code: 200,
      message: 'Project field deleted successfully',
    };
  }
}