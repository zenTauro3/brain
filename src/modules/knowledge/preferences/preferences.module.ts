import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferenceEntity } from './preferences.entity';
import { PreferencesService } from './preferences.service';

@Module({
  imports: [TypeOrmModule.forFeature([PreferenceEntity])],
  providers: [PreferencesService],
  exports: [PreferencesService],
})
export class PreferencesModule {}
