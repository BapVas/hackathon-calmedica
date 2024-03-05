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
import { Category } from '../utils/categories.types';
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

    const categories = {
      ...importedCategories,
      not_in_category: { type: 'not_in_category', responses: [] },
    };

    result.forEach((response) => {
      if (response.categories.length === 0) {
        categories['not_in_category'].responses.push(response);
      }

      response.categories.forEach((category) => {
        if (!categories[category.type]) {
          categories[category.type] = {
            type: category.type,
            responses: [],
          } as Category;
        }

        categories[category.type].responses.push(response);
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
