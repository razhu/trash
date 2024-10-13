import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAccountController } from './service-account.controller';
import { ServiceAccountService } from './service-account.service';

describe('ServiceAccountController', () => {
  let controller: ServiceAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceAccountController],
      providers: [ServiceAccountService],
    }).compile();

    controller = module.get<ServiceAccountController>(ServiceAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
