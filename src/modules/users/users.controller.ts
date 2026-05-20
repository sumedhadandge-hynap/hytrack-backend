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

import { UsersService } from './users.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


import { CreateUserDto }
  from './dto/create-user.dto';

import { UpdateUserDto }
  from './dto/update-user.dto';


import { ChangePasswordDto }
  from './dto/change-password.dto';


@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }



  // GET ALL USERS
  @Get()
  async findAll() {

    const result =
      await this.usersService.findAll();

    return {

      status: 'success',

      code: 200,

      message:
        'Users fetched successfully',

      result,
    };
  }

 
  // GET USER BY ID
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {

    const result =
      await this.usersService.findOne(id);

    return {

      status: 'success',

      code: 200,

      message:
        'User fetched successfully',

      result,
    };
  }

  //assign role to user
  @Post(':userId/roles')
  async assignRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: AssignRoleDto,
    @Req() req: any,
  ) {
    const result =
      await this.usersService.assignRole(
        userId,
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 201,
      message: 'Role assigned successfully',
      result,
    };
  }

  // GET USER ROLES
  @Get(':userId/roles')
  async getUserRoles(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const result =
      await this.usersService.getUserRoles(userId);

    return {
      status: 'success',
      code: 200,
      message: 'User roles fetched successfully',
      result,
    };
  }

  // cREATE USER
  @Post()
  async create(
    @Body() dto: CreateUserDto,
    @Req() req: any,
  ) {

    const result =
      await this.usersService.create(
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 201,
      message:
        'User created successfully',
      result,
    };
  }



  // UPDATE USER
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {

    const result =
      await this.usersService.update(
        id,
        dto,
        req.user?.id,
      );

    return {
      status: 'success',
      code: 200,
      message:
        'User updated successfully',
      result,
    };
  }




// CHANGE PASSWORD
  @Put(':id/change-password')
  async changePassword(

    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: ChangePasswordDto,

    @Req()
    req: any,
  ) {

    const result =
      await this.usersService.changePassword(

        id,

        dto,

        req.user?.id,
      );

    return {

      status: 'success',

      code: 200,

      message:
        'Password changed successfully',

      result,
    };
  }












}