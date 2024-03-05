import { Controller, Get } from '@nestjs/common';
import { AppService } from '../app.service';
import OpenAiConnector from "../services/OpenAiConnector";
import OpenAI from "openai";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    // const OpenAi = OpenAiConnector("my api key");
    //
    // const response = await OpenAi.query("Test");
    // return JSON.stringify(response);
    return JSON.stringify('ok');
  }
}
