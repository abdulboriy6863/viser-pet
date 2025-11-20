import { Controller, Get } from '@nestjs/common';
import { ViserpetBatchService } from './viserpet-batch.service';

@Controller()
export class ViserpetBatchController {
  constructor(private readonly viserpetBatchService: ViserpetBatchService) {}

  @Get()
  getHello(): string {
    return this.viserpetBatchService.getHello();
  }
}
