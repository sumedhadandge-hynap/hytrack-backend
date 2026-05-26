import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ServeStaticModule }
  from '@nestjs/serve-static';
import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { SidebarModule } from './modules/sidebar/sidebar.module';
import { PublicModule } from './modules/public/public.module';
import { AppTypesModule } from './modules/app-types/app-types.module';
import { AppsModule } from './modules/apps/apps.module';
import { AppStepsModule } from './modules/app-steps/app-steps.module';
import { AppFieldsModule } from './modules/app-fields/app-fields.module';
import { StepApproversModule } from './modules/step-approvers/step-approvers.module';
import { StepDiscussionsModule } from './modules/step-discussions/step-discussions.module';
import { AppVersionsModule } from './modules/app-versions/app-versions.module';
import { AppRecordsModule }
  from './modules/app-records/app-records.module';
import { join } from 'path';
import { AppRecordValuesModule }
  from './modules/app-record-values/app-record-values.module';
import { UploadModule } from './common/upload/upload.module';
import { CompanyProfileModule } from './modules/company-profile/company-profile.module';
import { ProjectsModule } from './modules/projects/projects.module';


@Module({
  // imports: [
  //   ConfigModule.forRoot({
  //     isGlobal: true,
  //   }),



  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/',
    }),
    DatabaseModule,
    LoggerModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
    SidebarModule,
    PublicModule,
    AppTypesModule,
    AppsModule,
    AppStepsModule,
    AppFieldsModule,
    StepApproversModule,
    StepDiscussionsModule,
    AppVersionsModule,
    AppRecordsModule,
    AppRecordValuesModule,
    UploadModule,
    CompanyProfileModule,
    ProjectsModule,

  ],
})
export class AppModule { }




