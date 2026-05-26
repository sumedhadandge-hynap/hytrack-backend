import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';

import type { DbType } from 'src/database/database.module';

import { companies } from 'src/database/schema';

@Injectable()
export class PublicService {
    constructor(
        @Inject('DB')
        private readonly db: DbType,
    ) { }

    async getCompanyInfo() {
        const company =
            await this.db.query.companies.findFirst({
                where: eq(companies.is_main, true),
                columns: {
                    id: true,
                    name: true,
                    logo_url: true,
                    website: true,
                    favicon_url: true,
                   
                },
            });

        if (!company) {
            throw new NotFoundException('Company not found');
        }

        return company;
    }
}