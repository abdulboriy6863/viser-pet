import { Module } from '@nestjs/common';
import { ViserpetBatchController } from './viserpet-batch.controller';
import { ViserpetBatchService } from './viserpet-batch.service';

@Module({
  imports: [],
  controllers: [ViserpetBatchController],
  providers: [ViserpetBatchService],
})
export class ViserpetBatchModule {}
