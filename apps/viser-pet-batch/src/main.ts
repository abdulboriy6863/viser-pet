import { NestFactory } from '@nestjs/core';
import { ViserpetBatchModule } from './viserpet-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(ViserpetBatchModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
