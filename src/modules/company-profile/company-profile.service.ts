import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { eq } from 'drizzle-orm';

import type { DbType }
  from 'src/database/database.module';

import {
  companies,
} from 'src/database/schema';

import { UpdateCompanyProfileDto }
  from './dto/update-company-profile.dto';

@Injectable()
export class CompanyProfileService {

  constructor(
    @Inject('DB')
    private readonly db: DbType,
  ) { }

  // GET MAIN COMPANY
  async getProfile() {

    const company =
      await this.db.query.companies.findFirst({
        where: eq(companies.is_main, true),
      });

    if (!company) {

      throw new NotFoundException(
        'Company not found',
      );
    }

    return company;
  }

  // UPDATE MAIN COMPANY
async updateProfile(
  dto: UpdateCompanyProfileDto,
  userId?: number,
) {
  const company =
    await this.db.query.companies.findFirst({
      where: eq(companies.is_main, true),
    });

  if (!company) {
    throw new NotFoundException(
      'Company not found',
    );
  }

  const [updated] =
    await this.db
      .update(companies)
      .set({
        ...dto,
        updated_by: userId ?? null,
        updated_at: new Date(),
      })
      .where(
        eq(
          companies.id,
          company.id,
        ),
      )
      .returning();

  return updated;
}


}