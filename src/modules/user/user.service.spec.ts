import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma';
import { ConfigService } from '@nestjs/config';
import { testAWS } from '../../constants';
import { CognitoService } from '../cognito';

// TODO: Add more tests
describe('UserService', () => {
  let service: UserService;

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
        CognitoService,
        PrismaService,
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
