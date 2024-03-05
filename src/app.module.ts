import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { CsvService } from './services/CSVService';
import { AppService } from './services/AppService';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseSchema } from './schema/Response.schema';
import { OpenAiConnector } from "./services/OpenAiConnector";

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/nest'),
    MongooseModule.forFeature([{ name: 'Response', schema: ResponseSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService, CsvService, OpenAiConnector],
})
export class AppModule {}
