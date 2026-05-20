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

import { SidebarService } from './sidebar.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/sidebar')
export class SidebarController {
    constructor(
        private readonly sidebarService: SidebarService,
    ) { }
    // create menu
    @Post('menus')
    async createMenu(
        @Body() dto: CreateMenuDto,
        @Req() req: any,
    ) {
        const result =
            await this.sidebarService.createMenu(
                dto,
                req.user?.id,
            );

        return {
            status: 'success',
            code: 201,
            message: 'Menu created successfully',
            result,
        };
    }
    // get all menus
    @Get('menus')
    async getAllMenus() {
        const result =
            await this.sidebarService.getAllMenus();

        return {
            status: 'success',
            code: 200,
            message: 'Menus fetched successfully',
            result,
        };
    }
    // get my menus
    @Get('my-menus')
    async getMyMenus(
        @Req() req: any,
    ) {
        const result =
            await this.sidebarService.getMyMenus(
                req.user.id,
            );

        return {
            status: 'success',
            code: 200,
            message: 'User menus fetched successfully',
            result,
        };
    }

    // get menu by id
    @Get('menus/:id')
    async getMenuById(
        @Param('id', ParseIntPipe) id: number,
    ) {
        const result =
            await this.sidebarService.getMenuById(id);

        return {
            status: 'success',
            code: 200,
            message: 'Menu fetched successfully',
            result,
        };
    }
    // update menu
    @Put('menus/:id')
    async updateMenu(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreateMenuDto,
        @Req() req: any,
    ) {
        const result =
            await this.sidebarService.updateMenu(
                id,
                dto,
                req.user?.id,
            );

        return {
            status: 'success',
            code: 200,
            message: 'Menu updated successfully',
            result,
        };
    }
    // delete menu
    @Delete('menus/:id')
    async deleteMenu(
        @Param('id', ParseIntPipe) id: number,
    ) {
        await this.sidebarService.deleteMenu(id);

        return {
            status: 'success',
            code: 200,
            message: 'Menu deleted successfully',
            result: null,
        };
    }


}