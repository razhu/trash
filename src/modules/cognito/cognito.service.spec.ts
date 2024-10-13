import { Test, TestingModule } from '@nestjs/testing';
import { CognitoService } from './cognito.service';
import { ConfigService } from 'aws-sdk';
import { testAWS } from '../../constants';

// TODO: Fix and add more tests
describe.skip('CognitoService', () => {
  let service: CognitoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'AWS_REGION') return testAWS.region;
              if (key === 'COGNITO_USER_POOL_CLIENT_ID')
                return testAWS.clientId;
            }),
          },
        },
        ,
        CognitoService,
      ],
    }).compile();

    service = module.get<CognitoService>(CognitoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
