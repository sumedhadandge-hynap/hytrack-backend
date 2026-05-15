// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';



// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),

//     TypeOrmModule.forRootAsync({
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         type: 'postgres',
//         host: configService.get<string>('DB_HOST'),
//         port: configService.get<number>('DB_PORT'),
//         username: configService.get<string>('DB_USERNAME'),
//         password: configService.get<string>('DB_PASSWORD'),
//         database: configService.get<string>('DB_NAME'),
//         autoLoadEntities: true,
//         synchronize: false,
//       }),
//     }),
//   ],
// })
// export class AppModule {}



import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// 1. Import your new modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    // 2. Add them to the imports array
    AuthModule,
    // UsersModule,
  ],
})
export class AppModule { }
