import { Module } from '@nestjs/common';
import { ViserpetBatchController } from './viserpet-batch.controller';
import { ViserpetBatchService } from './viserpet-batch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ViserpetBatchController],
  providers: [ViserpetBatchService],
})
export class ViserpetBatchModule {}
