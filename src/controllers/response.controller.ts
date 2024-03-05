import { Body, Controller, Get, Post } from '@nestjs/common';
import { ResponseService } from '../services/ResponseService';

@Controller()
export class ResponseController {
  constructor(protected readonly responseService: ResponseService) {}

  @Post('/responses')
  async newResponse(@Body() body: any): Promise<string> {
    const result = await this.responseService.saveResponse(null, body.message);

    return JSON.stringify(result);
  }
}
