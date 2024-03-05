import { Controller, Get } from '@nestjs/common';
import { CsvService } from '../services/CSVService';
import * as fs from 'fs';
import mongoAggregates from '../services/mongoAggregates';
import toAnalyseResponses from '../queries/toAnalyseResponses';

// Read csv file, create for each lines a mongo document and save it {id: XX, message: "XX", score: "XX", isAnalysed: false, shouldBeAnalysed: true, categories: [{name: "XX", score: "XX", isAIGenerated: "XX"}]}

@Controller()
export class AppController {
  constructor(private readonly csvService: CsvService) {}

  @Get()
  async getHello(): Promise<string> {
    // const OpenAi = OpenAiConnector("my api key");
    //
    // const response = await OpenAi.query("Test");
    // return JSON.stringify(response);
    return JSON.stringify('ok');
  }

  @Get('import')
  async import(): Promise<string> {
    // File is in the files folder ../files/test.csv, use node fs to get the file path
    await this.csvService.importCsv('./src/files/data.csv');

    return JSON.stringify('ok');
  }

  @Get('graph')
  async graph(): Promise<string> {
    const test = await toAnalyseResponses;
    console.log(await toAnalyseResponses);
    console.log(await mongoAggregates().messageCountByCategory());

    return 'ok';
  }
}
