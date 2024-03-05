import { Controller, Get } from '@nestjs/common';
import { CsvService } from '../services/CSVService';
import { OpenAiConnector } from '../services/OpenAiConnector'; // Adjust the path
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';

// Read csv file, create for each lines a mongo document and save it {id: XX, message: "XX", score: "XX", isAnalysed: false, shouldBeAnalysed: true, categories: [{name: "XX", score: "XX", isAIGenerated: "XX"}]}

@Controller()
export class AppController {
  constructor(
    private readonly csvService: CsvService,
    private readonly openAiConnector: OpenAiConnector,
    @InjectModel('Response') private readonly responseModel: Model<any>,
  ) {}

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

  @Get('testPrompt')
  async testPrompt(): Promise<string> {
    try {
      const batchSize = 3;
      let allResponses = [];

      while (true) {
        const responses = await this.responseModel
          .find({ shouldBeAnalysed: true, isAnalysed: false })
          .select('content')
          .limit(batchSize)
          .exec();

        if (responses.length === 0) {
          break; // No more documents to process
        }

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
          console.log('promptResults: ', promptResults);

          for (const promptResult of promptResults) {
            // we save it to the database
            console.log('promptResult: ', promptResult);
            console.log('categories: ', promptResult.categories);
            const generalCategory = promptResult.categories.find(category => category.name === 'general') ?? { score: 4 };
            await this.responseModel.findByIdAndUpdate(
              promptResult.id,
              { $set: { categories: promptResult.categories, score: generalCategory.score } },
            );
          }

        } catch (error) {
          console.error('Error in testPrompt:', error);
        }

        // Update 'isAnalysed' field for the current batch
        const responseIds = responses.map((response) => response._id);
        await this.responseModel.updateMany(
          { _id: { $in: responseIds } },
          { $set: { isAnalysed: true } },
        );

        allResponses = allResponses.concat(responses);
      }

      return JSON.stringify(allResponses);
    } catch (error) {
      console.error('Error in getBatchOf50:', error);
      throw error;
    }
  }

  // @Get('getBatchOf50')
  // async getBatchOf50(): Promise<string> {
  //
  // }
}
