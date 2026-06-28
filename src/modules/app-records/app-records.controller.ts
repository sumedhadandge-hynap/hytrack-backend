// import {
//   Controller,
//   Post,
//   Get,
//   Body,
//   Param,
//   Query,
//   Req,
//   ParseIntPipe,
//   UseGuards,
// } from '@nestjs/common';

// import { AppRecordsService } from './app-records.service';
// import { CreateAppRecordDto } from './dto/create-app-record.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
// @Controller('api/app-records')
// export class AppRecordsController {
//   constructor(private readonly appRecordsService: AppRecordsService) {}

//   @Post()
//   async create(@Body() dto: CreateAppRecordDto, @Req() req: any) {
//     const result = await this.appRecordsService.create(dto, req.user?.id);

//     return {
//       status: 'success',
//       code: 201,
//       message: 'Record created successfully',
//       result,
//     };
//   }

//   @Get('app/:appId')
//   async findByApp(
//     @Param('appId', ParseIntPipe) appId: number,
//     @Query('version_id', ParseIntPipe) versionId: number,
//   ) {
//     const result = await this.appRecordsService.findByApp(appId, versionId);

//     return {
//       status: 'success',
//       code: 200,
//       message: 'App records fetched successfully',
//       result,
//     };
//   }

//   @Get(':id')
//   async findOne(@Param('id', ParseIntPipe) id: number) {
//     const result = await this.appRecordsService.findOne(id);

//     return {
//       status: 'success',
//       code: 200,
//       message: 'Record fetched successfully',
//       result,
//     };
//   }
// }

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppRecordsService } from './app-records.service';
import { CreateAppRecordDto } from './dto/create-app-record.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/app-records')
export class AppRecordsController {
  constructor(
    private readonly appRecordsService: AppRecordsService,
  ) {}

  @Get('app/:appId/schema')
  async getRecordSchema(
    @Param('appId', ParseIntPipe)
    appId: number,

    @Query('company_id')
    companyId?: string,

    @Query('project_id')
    projectId?: string,
  ) {
    const result =
      await this.appRecordsService.getRecordSchema(
        appId,
        companyId ? Number(companyId) : undefined,
        projectId ? Number(projectId) : undefined,
      );

    return {
      status: 'success',
      code: 200,
      message: 'Record schema fetched successfully',
      result,
    };
  }

  @Post()
  async create(
    @Body()
    dto: CreateAppRecordDto,

    @Req()
    req: any,
  ) {
    const result =
      await this.appRecordsService.create(
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 201,
      message: 'Record created successfully',
      result,
    };
  }

  @Get('app/:appId')
  async findByApp(
    @Param('appId', ParseIntPipe)
    appId: number,

    @Query('version_id')
    versionId?: string,
  ) {
    const result =
      await this.appRecordsService.findByApp(
        appId,
        versionId ? Number(versionId) : undefined,
      );

    return {
      status: 'success',
      code: 200,
      message: 'App records fetched successfully',
      result,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    const result =
      await this.appRecordsService.findOne(id);

    return {
      status: 'success',
      code: 200,
      message: 'Record fetched successfully',
      result,
    };
  }
}