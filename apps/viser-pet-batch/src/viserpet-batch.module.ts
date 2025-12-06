import { Module } from '@nestjs/common';
import { ViserpetBatchController } from './viserpet-batch.controller';
import { ViserpetBatchService } from './viserpet-batch.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
  controllers: [ViserpetBatchController],
  providers: [ViserpetBatchService],
})
export class ViserpetBatchModule {}
