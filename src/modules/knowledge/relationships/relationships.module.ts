import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationshipEntity } from './relationships.entity';
import { RelationshipsService } from './relationships.service';

@Module({
  imports: [TypeOrmModule.forFeature([RelationshipEntity])],
  providers: [RelationshipsService],
  exports: [RelationshipsService],
})
export class RelationshipsModule {}
