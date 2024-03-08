import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponsesDocument } from '../utils/Responses.types';
import { defaultCategory } from '../utils/categories';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel('Response') private readonly responseModel: Model<any>,
  ) {}

  async saveResponse(
    id: string | null,
    content: any,
  ): Promise<ResponsesDocument> {
    if (id === null) {
      id = Math.floor(Math.random() * 1000000) + '-' + new Date().getTime();
    }

    const score = isNaN(content) ? null : parseInt(content);
    const categories = [];

    if (score !== null) {
      categories.push({ ...defaultCategory, score: score });
    }

    const response = new this.responseModel({
      id: id,
      content: content,
      isAnalysed: false,
      shouldBeAnalysed: isNaN(content),
      categories: categories,
      date: new Date(),
    });

    await response.save();

    return response;
  }

  getResponses(): Promise<ResponsesDocument[]> {
    return this.responseModel.find().exec();
  }

  async deleteResponse(id: string): Promise<ResponsesDocument> {
    return this.responseModel.findOneAndDelete({ id: id });
  }
}
