import {
  Controller,
  Post,
  Body,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';

import { AuthService } from './auth.service';

import { SetupDto } from './dto/setup.dto';

import { LoginDto } from './dto/login.dto';

import { sendResponse } from 'src/common/utils/response';

@Controller('api/auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) { }

  // =========================================
  // SETUP API
  // =========================================

  @Post('setup')
  async setup(
    @Body() dto: SetupDto,
    @Res() res: Response,
  ) {

    const result =
      await this.authService.setup(dto);

    return sendResponse(
      res,
      201,
      'Setup completed successfully',
      result,
    );
  }

  // =========================================
  // LOGIN API
  // =========================================

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
  ) {

    const result =
      await this.authService.login(dto);

    return sendResponse(
      res,
      200,
      'Login successful',
      result,
    );
  }
}