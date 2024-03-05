import { Controller, Get, Param, Render } from '@nestjs/common';
import { CsvService } from '../services/CSVService';
import mongoAggregates from '../services/mongoAggregates';
import { OpenAiConnector } from '../services/OpenAiConnector'; // Adjust the path
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';

// Read csv file, create for each line a mongo document and save it {id: XX, message: "XX", score: "XX", isAnalysed: false, shouldBeAnalysed: true, categories: [{name: "XX", score: "XX", isAIGenerated: "XX"}]}

@Controller()
export class AppController {
  constructor(
    private readonly csvService: CsvService,
    private readonly openAiConnector: OpenAiConnector,
    @InjectModel('Response') private readonly responseModel: Model<any>,
  ) {}

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

    const labels = [];
    const averages = [];
    for (const i in data) {
      const row = data[i];
      labels.push(row._id);
      averages.push(row.averageScore);
    }

    return {
      labels: labels,
      averages: averages,
    };
  }

  @Get('summary/:category/:scores')
  async summary(@Param() params: { category: string; scores: string }) {
    const scoresArrayAsString = params.scores.split('-');
    const scoresArrayAsNumbers = scoresArrayAsString.map((value) =>
      parseInt(value),
    );

    await mongoAggregates().messagesByScoresAndCategory(
      scoresArrayAsNumbers,
      params.category,
    );

    const filePath = './src/files/prompt-summary.txt';
    const summaryPrompt = fs.readFileSync(filePath, 'utf8');

    const result = await this.openAiConnector.query(summaryPrompt);

    return result.choices[0].message.content;
  }

  @Get('/analyze')
  async analyze(): Promise<string> {
    try {
      const batchSize = 25;
      let allResponses = [];

      while (true) {
        const responses = await this.responseModel
          .find({ shouldBeAnalysed: true, isAnalysed: false })
          .select('content')
          .limit(batchSize)
          .exec();

        if (responses.length === 0) {
          console.log('no more documents to process');
          break; // No more documents to process
        }
        console.log('ok');

        const filePath = './src/files/prompt.txt';
        const csvData = fs.readFileSync(filePath, 'utf8');
        const promptText = csvData.replace(
          '//promptText//',
          JSON.stringify(responses),
        );
        const formattedPrompt = promptText.replace(/\s+/g, ' ').trim();

        try {
          const result = await this.openAiConnector.query(formattedPrompt);

          const promptResults = JSON.parse(result.choices[0].message.content);

          for (const promptResult of promptResults) {
            // we save it to the database
            await this.responseModel.findByIdAndUpdate(promptResult.id, {
              $set: { categories: promptResult.categories, isAnalysed: true },
            });
          }
        } catch (error) {
          console.error('Error in testPrompt:', error);
        }

        allResponses = allResponses.concat(responses);
      }

      return JSON.stringify(allResponses);
    } catch (error) {
      console.error('Error in getBatchOf50:', error);
      throw error;
    }
  }
}
