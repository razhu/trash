import { Controller, Get } from '@nestjs/common';
import { LegalService } from './legal.service';
import { Public } from '../../common/decorators';
import { TermsAndConditionsResponseDto } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Legal')
@Controller('legal')
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  @Public()
  @Get('terms-and-conditions')
  @ApiResponse({
    type: TermsAndConditionsResponseDto,
  })
  async getTermsAndConditions(): Promise<TermsAndConditionsResponseDto> {
    return this.legalService.getTermsAndConditions();
  }
}
