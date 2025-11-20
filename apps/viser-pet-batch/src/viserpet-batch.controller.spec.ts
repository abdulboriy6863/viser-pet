import { Test, TestingModule } from '@nestjs/testing';
import { ViserpetBatchController } from './viserpet-batch.controller';
import { ViserpetBatchService } from './viserpet-batch.service';

describe('ViserpetBatchController', () => {
  let viserpetBatchController: ViserpetBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ViserpetBatchController],
      providers: [ViserpetBatchService],
    }).compile();

    viserpetBatchController = app.get<ViserpetBatchController>(
      ViserpetBatchController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(viserpetBatchController.getHello()).toBe('Hello World!');
    });
  });
});
