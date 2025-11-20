import { Injectable } from '@nestjs/common';

@Injectable()
export class ViserpetBatchService {
  getHello(): string {
    return 'Welcome to Viser Pat BATCH server';
  }
}
