import {
  Global,
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
} from '@nestjs/common';

import { ConfigService }
  from '@nestjs/config';

import {
  drizzle,
  NodePgDatabase,
} from 'drizzle-orm/node-postgres';

import * as dbSchema
  from './schema';

import { Pool } from 'pg';

export type DbType =
  NodePgDatabase<typeof dbSchema>;

@Global()
@Module({

  providers: [

    // ====================================
    // POSTGRES CONNECTION POOL
    // ====================================

    {
      provide: 'DB_POOL',

      inject: [ConfigService],

      useFactory: async (
        configService: ConfigService,
      ): Promise<Pool> => {

        const logger =
          new Logger('DatabaseModule');

        const connectionString =
          configService.get<string>(
            'DATABASE_URL',
          );


        if (!connectionString) {

          throw new Error(
            'DATABASE_URL not found',
          );
        }

        logger.log(
          'Initializing database connection...',
        );

        const pool = new Pool({

          connectionString,

          max: 10,

          idleTimeoutMillis: 30000,

          connectionTimeoutMillis: 2000,
        });

        // DATABASE HEALTH CHECK

        try {

          await pool.query('SELECT 1');

          logger.log(
            '✅ Database connected successfully',
          );

        } catch (error) {

          logger.error(
            '❌ Database connection failed',
            error,
          );

          throw error;
        }

        return pool;
      },
    },

    // ====================================
    // DRIZZLE ORM INSTANCE
    // ====================================

    {
      provide: 'DB',

      inject: ['DB_POOL'],

      useFactory: (
        pool: Pool,
      ): DbType => {

        return drizzle(pool, {
          schema: dbSchema,
        });
      },
    },
  ],

  exports: [
    'DB',
    'DB_POOL',
  ],
})

export class DatabaseModule
  implements OnModuleDestroy {

  private readonly logger =
    new Logger('DatabaseModule');

  constructor(

    @Inject('DB_POOL')
    private readonly dbPool: Pool,
  ) { }

  async onModuleDestroy() {

    this.logger.log(
      'Closing database pool...',
    );

    await this.dbPool.end();

    this.logger.log(
      '✅ Database pool closed',
    );
  }
}