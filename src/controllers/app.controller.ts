import { Controller, Get, Param, Render } from '@nestjs/common';
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
  @Render('graph.hbs')
  async graph() {
  }

  @Get('graph-data-counts')
  async graphdatacounts() {
    const data = await mongoAggregates().messageCountByCategory();

    let labels = [];
    let counts = [];
    for(var i in data) {
      const row = data[i];
      labels.push(row._id);
      counts.push(row.count);
    }

    return {
      labels: labels,
      counts: counts
    };
  }
  @Get('graph-data-averages')
  async graphdataaverages() {
    const data = await mongoAggregates().averagesByCategory();

    let labels = [];
    let averages = [];
    for(var i in data) {
      const row = data[i];
      labels.push(row._id);
      averages.push(row.averageScore);
    }

    return {
      labels: labels,
      averages: averages
    };
  }

  @Get('summary/:category/:scores')
  async summary(@Param() params: { category: string, scores: string }) {
    const scoresArrayAsString = params.scores.split('-');
    const scoresArrayAsNumbers = scoresArrayAsString.map((value) => parseInt(value));

    const data = await mongoAggregates().messagesByScoresAndCategory(scoresArrayAsNumbers, params.category);

    return JSON.stringify(data);
  }
}
