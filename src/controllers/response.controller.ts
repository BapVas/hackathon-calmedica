import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Render,
} from '@nestjs/common';
import { ResponseService } from '../services/ResponseService';
import { ResponsesDocument } from '../utils/Responses.types';
import { categories as importedCategories } from '../utils/categories';

@Controller()
export class ResponseController {
  constructor(protected readonly responseService: ResponseService) {}

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

    const categories = { ...importedCategories };

    result.forEach((response) => {
      if (response.categories.length === 0) {
        categories['not_in_category'].responses.push(response);
      }

      response.categories.forEach((category) => {
        categories[category.name].responses.push(response);
      });
    });

    Object.keys(categories).forEach((category: string) => {
      Object.keys(categories[category].responses).forEach((response) => {
        const element = categories[category].responses[response];
        element.scores = {};
        element.categories.forEach((cat) => {
          element.scores[cat.name] = cat.score;
        });
        element.scores = JSON.stringify(element.scores);
      });
    });

    return { categories };
  }

  @Delete('/responses/:id')
  async deleteResponse(@Param('id') id: any): Promise<string> {
    const result: ResponsesDocument =
      await this.responseService.deleteResponse(id);

    return JSON.stringify(result);
  }
}
