import mongoose from 'mongoose';
import { ResponseSchema } from '../schema/Response.schema';
import { MongoClient } from 'mongodb';

async function getNext50UnprocessedDocuments() {
  try {
    const mongodb = new MongoClient("mongodb://mongo:27017");
    await mongodb.connect();
    const database = mongodb.db('nest');
    const collection = database.collection('responses');

    return await collection.find({ shouldBeAnalysed: true, isAnalysed: false })
      .limit(50)
      .skip(0)
      .toArray();
  } catch (error) {
    console.error('Error retrieving documents:', error);
    throw error;
  }
}

export default getNext50UnprocessedDocuments();