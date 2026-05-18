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
} from '@nestjs/common';

import { PermissionsService } from './permissions.service';

import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('api/permissions')
export class PermissionsController {
    constructor(
        private readonly permissionsService: PermissionsService,
    ) { }

    @Post()
    async create(
        @Body() dto: CreatePermissionDto,
        @Req() req: any,
    ) {
        const result =
            await this.permissionsService.create(
                dto,
                req.user?.id,
            );

        return {
            status: 'success',
            code: 201,
            message: 'Permission created successfully',
            result,
        };
    }

    @Get()
    async findAll() {
        const result =
            await this.permissionsService.findAll();

        return {
            status: 'success',
            code: 200,
            message: 'Permissions fetched successfully',
            result,
        };
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ) {
        const result =
            await this.permissionsService.findOne(id);

        return {
            status: 'success',
            code: 200,
            message: 'Permission fetched successfully',
            result,
        };
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePermissionDto,
        @Req() req: any,
    ) {
        const result =
            await this.permissionsService.update(
                id,
                dto,
                req.user?.id,
            );

        return {
            status: 'success',
            code: 200,
            message: 'Permission updated successfully',
            result,
        };
    }

    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ) {
        await this.permissionsService.remove(id);

        return {
            status: 'success',
            code: 200,
            message: 'Permission deleted successfully',
            result: null,
        };
    }
}