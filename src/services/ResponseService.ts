import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel('Response') private readonly responseModel: Model<any>,
  ) {}

  async saveResponse(id: string, content: any): Promise<void> {
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
    });

    await response.save();

    return response;
  }
}
