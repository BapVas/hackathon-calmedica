import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponsesDocument } from '../utils/Responses.types';

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

    const response = new this.responseModel({
      id: id,
      content: content,
      score: score,
      isAnalysed: false,
      shouldBeAnalysed: isNaN(content),
      categories: [],
      date: new Date(),
    });

    await response.save();

    return response;
  }

  async getResponses(): Promise<ResponsesDocument[]> {
    return await this.responseModel.find();
  }

  async deleteResponse(id: string): Promise<ResponsesDocument> {
    return await this.responseModel.findOneAndDelete({ id: id });
  }
}
