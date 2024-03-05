import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { CsvService } from './services/CSVService';
import { AppService } from './services/AppService';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseSchema, ResponseSchemaName } from './schema/Response.schema';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { ResponseService } from './services/ResponseService';
import { ResponseController } from './controllers/response.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env.local',
        '.env.development',
        '.env.production',
        '.env',
      ],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: ResponseSchemaName, schema: ResponseSchema },
    ]),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
  ],
  controllers: [AppController, ResponseController],
  providers: [AppService, CsvService, ResponseService],
})
export class AppModule {}
