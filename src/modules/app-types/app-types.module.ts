import { Module } from '@nestjs/common';
import { AppTypesService } from './app-types.service';
import { AppTypesController } from './app-types.controller';


@Module({
    controllers: [AppTypesController],
    providers: [AppTypesService],
    exports: [AppTypesService],
})
export class AppTypesModule { }