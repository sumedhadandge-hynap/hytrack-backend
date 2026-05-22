import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { StepApproversService }
  from './step-approvers.service';

import { CreateStepApproverDto }
  from './dto/create-step-approver.dto';

@Controller('api/step-approvers')
export class StepApproversController {

  constructor(
    private readonly stepApproversService:
      StepApproversService,
  ) { }

  @Post()
  async create(
    @Body()
    dto: CreateStepApproverDto,
  ) {

    const result =
      await this.stepApproversService.create(dto);

    return {
      status: 'success',
      code: 201,
      message:
        'Step approver created successfully',
      result,
    };
  }

  @Get()
  async findAll() {

    const result =
      await this.stepApproversService.findAll();

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
      await this.stepApproversService.findByStep(
        stepId,
      );

    return {
      status: 'success',
      code: 200,
      result,
    };
  }
}