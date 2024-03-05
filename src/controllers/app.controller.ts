import { Controller, Get, Render } from '@nestjs/common';
import { CsvService } from '../services/CSVService';
import * as fs from 'fs';
import mongoAggregates from '../services/mongoAggregates';
import toAnalyseResponses from '../queries/toAnalyseResponses';

// Read csv file, create for each line a mongo document and save it {id: XX, message: "XX", score: "XX", isAnalysed: false, shouldBeAnalysed: true, categories: [{name: "XX", score: "XX", isAIGenerated: "XX"}]}

@Controller()
export class AppController {
  constructor(private readonly csvService: CsvService) {}

  @Get()
  @Render('index.hbs')
  getHello() {
    return {
      title: 'Hello World!',
    };
  }

  @Get('import')
  async import(): Promise<string> {
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
