import { NestFactory } from '@nestjs/core';
import { ViserpetBatchModule } from './viserpet-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(ViserpetBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();
