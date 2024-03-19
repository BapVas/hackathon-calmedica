import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render,
} from '@nestjs/common';
import { ResponseService } from '../services/ResponseService';
import { ResponsesDocument } from '../utils/Responses.types';
import { categories as importedCategories } from '../utils/categories';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Controller()
export class ResponseController {
  constructor(
    protected readonly responseService: ResponseService,
    @InjectModel('Response') private readonly responseModel: Model<any>,
  ) {}

  @Post('/responses')
  async newResponse(@Body() body: any): Promise<string> {
    const result: ResponsesDocument = await this.responseService.saveResponse(
      null,
      body.message,
    );

    return JSON.stringify(result);
  }

  @Get('/admin')
  @Render('admin')
  async getResponses() {
    const result: ResponsesDocument[] =
      await this.responseService.getResponses();

    const categories = JSON.parse(JSON.stringify(importedCategories));

    result.forEach((response) => {
      if (response.categories.length === 0) {
        categories['not_in_category'].responses.push(response);
      }

      const scores = {};
      response.categories.forEach((category) => {
        categories[category.name]?.responses.push(response);
        scores[category.name] = category.score;
      });
      response.scores = JSON.stringify(scores);
    });

    return { categories };
  }

  @Delete('/responses/:id')
  async deleteResponse(@Param('id') id: any): Promise<string> {
    const result: ResponsesDocument =
      await this.responseService.deleteResponse(id);

    return JSON.stringify(result);
  }

  @Patch('/change-state/:id')
  async resetResponse(@Param('id') id: any): Promise<string> {
    await this.responseModel.findByIdAndUpdate(id, {
      $set: { isAnalysed: false, categories: [] },
    });

    return JSON.stringify('OK');
  }
}
