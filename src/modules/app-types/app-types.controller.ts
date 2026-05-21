import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards, } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { AppTypesService } from './app-types.service';

import { CreateAppTypeDto } from './dto/create-app-type.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/app-types')
export class AppTypesController {

    constructor(
        private readonly appTypesService: AppTypesService,
    ) { }

    @Post()
    async create(
        @Body() dto: CreateAppTypeDto,
        @Req() req: any,
    ) {

        const result =
            await this.appTypesService.create(
                dto,
                req.user?.id,
            );

        return {
            status: 'success',
            code: 201,
            message:
                'App type created successfully',
            result,
        };
    }

    @Get()
    async findAll() {

        const result =
            await this.appTypesService.findAll();

        return {
            status: 'success',
            code: 200,
            message:
                'App types fetched successfully',
            result,
        };
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe)
        id: number,
    ) {

        const result =
            await this.appTypesService.findOne(id);

        return {
            status: 'success',
            code: 200,
            message:
                'App type fetched successfully',
            result,
        };
    }
}