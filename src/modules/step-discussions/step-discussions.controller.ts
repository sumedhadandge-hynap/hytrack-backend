import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { StepDiscussionsService }
from './step-discussions.service';

import { CreateStepDiscussionDto }
from './dto/create-step-discussion.dto';

@Controller('api/step-discussions')
export class StepDiscussionsController {

  constructor(
    private readonly stepDiscussionsService:
      StepDiscussionsService,
  ) {}

  @Post()
  async create(
    @Body()
    dto: CreateStepDiscussionDto,
  ) {

    const result =
      await this.stepDiscussionsService.create(dto);

    return {
      status: 'success',
      code: 201,
      message:
        'Step discussion created successfully',
      result,
    };
  }

  @Get()
  async findAll() {

    const result =
      await this.stepDiscussionsService.findAll();

    return {
      status: 'success',
      code: 200,
      result,
    };
  }

  @Get('step/:stepId')
  async findByStep(
    @Param(
      'stepId',
      ParseIntPipe,
    )
    stepId: number,
  ) {

    const result =
      await this.stepDiscussionsService.findByStep(
        stepId,
      );

    return {
      status: 'success',
      code: 200,
      result,
    };
  }
}