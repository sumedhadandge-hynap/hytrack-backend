import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
from '../auth/guards/jwt-auth.guard';

import { CompanyProfileService }
from './company-profile.service';

import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { companies } from 'src/database/schema';

@UseGuards(JwtAuthGuard)
@Controller('api/company-profile')
export class CompanyProfileController {

  constructor(
    private readonly companyProfileService:
      CompanyProfileService,
  ) {}

  // GET PROFILE
  @Get()
  async getProfile() {

    const result =
      await this.companyProfileService
        .getProfile();
        

    return {
      status: 'success',
      code: 200,
      message:
        'Company profile fetched successfully',
      result,
    };
  }

  // UPDATE PROFILE

@Put()
async updateProfile(
  @Body()
  dto: UpdateCompanyProfileDto,

  @Req()
  req: any,
) {
  const result =
    await this.companyProfileService.updateProfile(
      dto,
      req.user?.id,
    );

  return {
    status: 'success',
    code: 200,
    message: 'Company profile updated successfully',
    result,
  };
}
}