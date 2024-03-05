import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs-extra';
import * as csvParser from 'csv-parser';
import { Model } from 'mongoose';
import { exit } from '@nestjs/cli/actions';

@Injectable()
export class CsvService {
  constructor(
    @InjectModel('Response') private readonly responseModel: Model<any>,
  ) {}

  async importCsv(filePath: string): Promise<void> {
    const data: any[] = [];
    await fs
      .createReadStream(filePath)
      .pipe(csvParser({ separator: ';' }))
      .on('data', (row: any) => data.push(row))
      .on('end', async () => {
        for (const row of data) {
          await this.saveResponse(row);
        }
      });
  }

  async saveResponse(row: any): Promise<void> {
    const response = new this.responseModel({
      id: row.id,
      content: row.content,
      score: null,
      isAnalysed: false,
      shouldBeAnalysed: isNaN(row.content),
      categories: [],
    });

    await response.save();
  }
}
