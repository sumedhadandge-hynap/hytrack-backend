import {
    Controller,
    Get,
} from '@nestjs/common';

import { PublicService } from './public.service';

@Controller('api/public')
export class PublicController {
    constructor(
        private readonly publicService: PublicService,
    ) { }

    @Get('company')
    async getCompanyInfo() {
        const result =
            await this.publicService.getCompanyInfo();

        return {
            status: 'success',
            code: 200,
            message: 'Company info fetched successfully',
            result,
        };
    }
}