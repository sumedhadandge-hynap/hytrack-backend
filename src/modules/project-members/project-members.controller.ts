import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
from '../auth/guards/jwt-auth.guard';

import { ProjectMembersService }
from './project-members.service';

import { CreateProjectMemberDto }
from './dto/create-project-member.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/project-members')
export class ProjectMembersController {
  constructor(
    private readonly projectMembersService:
      ProjectMembersService,
  ) {}

  @Post()
  async add(
    @Body() dto: CreateProjectMemberDto,
  ) {
    const result =
      await this.projectMembersService.add(dto);

    return {
      status: 'success',
      code: 201,
      message: 'Project member added successfully',
      result,
    };
  }

  @Get('project/:projectId')
  async findByProject(
    @Param('projectId', ParseIntPipe)
    projectId: number,
  ) {
    const result =
      await this.projectMembersService
        .findByProject(projectId);

    return {
      status: 'success',
      code: 200,
      message: 'Project members fetched successfully',
      result,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.projectMembersService.remove(id);

    return {
      status: 'success',
      code: 200,
      message: 'Project member removed successfully',
    };
  }
}