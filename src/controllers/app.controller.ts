import { Controller, Get, Render } from '@nestjs/common';
import { CsvService } from '../services/CSVService';
import mongoAggregates from '../services/mongoAggregates';

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
  async graph() {}

  @Get('graph-data-counts')
  async graphdatacounts() {
    const data = await mongoAggregates().messageCountByCategory();

    const labels = [];
    const counts = [];
    for (const i in data) {
      const row = data[i];
      labels.push(row._id);
      counts.push(row.count);
    }

    return {
      labels: labels,
      counts: counts,
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
}
