import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Req,
} from '@nestjs/common';

import { RolesService }
    from './roles.service';

import { CreateRoleDto }
    from './dto/create-role.dto';

import { AssignPermissionDto }
    from './dto/assign-permission.dto';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('api/roles')
export class RolesController {

    constructor(

        private readonly rolesService:
            RolesService,
    ) { }

    // =====================================
    // CREATE ROLE
    // =====================================

    @Post()
    async create(
        @Body() dto: CreateRoleDto,
        @Req() req: any,
    ) {

        const result =
            await this.rolesService.create(
                dto,
                req.user?.id,
            );

        return {
            status: 'success',
            code: 201,
            message:
                'Role created successfully',
            result,
        };
    }

    // =====================================
    // GET ALL ROLES
    // =====================================

    @Get()
    async findAll() {

        const result =
            await this.rolesService.findAll();

        return {
            status: 'success',
            code: 200,
            message:
                'Roles fetched successfully',
            result,
        };
    }

    // =====================================
    // ASSIGN PERMISSION
    // =====================================

    @Post(':roleId/permissions')
    async assignPermission(

        @Param(
            'roleId',
            ParseIntPipe,
        )
        roleId: number,

        @Body()
        dto: AssignPermissionDto,

        @Req()
        req: any,
    ) {

        const result =
            await this.rolesService
                .assignPermission(
                    roleId,
                    dto,
                    req.user?.id,
                );

        return {
            status: 'success',
            code: 201,
            message:
                'Permission assigned successfully',
            result,
        };
    }

    // =====================================
    // GET ROLE PERMISSIONS
    // =====================================

    @Get(':roleId/permissions')
    async getRolePermissions(

        @Param(
            'roleId',
            ParseIntPipe,
        )
        roleId: number,
    ) {

        const result =
            await this.rolesService
                .getRolePermissions(roleId);

        return {
            status: 'success',
            code: 200,
            message:
                'Role permissions fetched successfully',
            result,
        };
    }

    // Delete Permission from Role
    @Delete(
        ':roleId/permissions/:permissionId',
    )
    async removePermission(

        @Param(
            'roleId',
            ParseIntPipe,
        )
        roleId: number,

        @Param(
            'permissionId',
            ParseIntPipe,
        )
        permissionId: number,
    ) {

        await this.rolesService.removePermission(
            roleId,
            permissionId,
        );

        return {

            status: 'success',

            code: 200,

            message:
                'Permission removed successfully',
        };
    }




}