import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as csvParser from 'csv-parser';
import { ResponseService } from './ResponseService';
import { ResponsesRow } from '../utils/Responses.types';

@Injectable()
export class CsvService {
  constructor(private readonly $responseService: ResponseService) {}

  async importCsv(filePath: string): Promise<void> {
    const data: ResponsesRow[] = [];
    await fs
      .createReadStream(filePath)
      .pipe(csvParser({ separator: ';' }))
      .on('data', (row: ResponsesRow) => data.push(row))
      .on('end', async () => {
        for (const row of data) {
          await this.$responseService.saveResponse(row.id, row.content);
        }
      });
  }
}
