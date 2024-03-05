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
      const message = 'Alec is a good guy, what do you think?'; // Set your desired prompt message
      const result = await this.openAiConnector.query(message);

      // Process the result or return it directly, depending on your needs
      return JSON.stringify(result);
    } catch (error) {
      console.error('Error in testPrompt:', error);
      throw error;
    }
  }

  @Get('getBatchOf50')
  async getBatchOf50(): Promise<string> {
    try {
      // Assuming your model name for "responses" is 'Response'
      const responses = await this.responseModel.find().limit(50).exec();

      // Process the results or return them directly, depending on your needs
      return JSON.stringify(responses);
    } catch (error) {
      console.error('Error in getBatchOf50:', error);
      throw error;
    }
  }
}
