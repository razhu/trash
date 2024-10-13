import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators';

@ApiTags('Base URL')
@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get()
  getApplication(): string {
    return 'Pando API is available';
  }
}
