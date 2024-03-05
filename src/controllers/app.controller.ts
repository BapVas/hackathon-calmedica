import { Controller, Get, Post } from '@nestjs/common';
import { CsvService } from '../services/CSVService';
import { OpenAiConnector } from '../services/OpenAiConnector'; // Adjust the path
import * as fs from 'fs';

// Read csv file, create for each lines a mongo document and save it {id: XX, message: "XX", score: "XX", isAnalysed: false, shouldBeAnalysed: true, categories: [{name: "XX", score: "XX", isAIGenerated: "XX"}]}

@Controller()
export class AppController {
  constructor(
    private readonly csvService: CsvService,
    private readonly openAiConnector: OpenAiConnector,
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
    const filePath = './src/files/prompt.txt';
    const csvData = fs.readFileSync(filePath, 'utf8');
    const responses = 'dddddddddd';
    const promptText = csvData.replace('//promptText//', responses);
    console.log(promptText);
    return JSON.stringify(promptText);

    // try {
    //   const message = 'Alec is a good guy, what do you think?'; // Set your desired prompt message
    //   const result = await this.openAiConnector.query(message);

    //   // Process the result or return it directly, depending on your needs
    //   return JSON.stringify(result);
    // } catch (error) {
    //   console.error('Error in testPrompt:', error);
    //   throw error;
    // }
  }
}
