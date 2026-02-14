import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraitEntity } from './traits.entity';
import { TraitsService } from './traits.service';

@Module({
  imports: [TypeOrmModule.forFeature([TraitEntity])],
  providers: [TraitsService],
  exports: [TraitsService],
})
export class TraitsModule {}
