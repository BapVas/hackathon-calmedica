import { MongoClient } from 'mongodb';
import * as process from 'process';

async function getNext50UnprocessedDocuments() {
  try {
    const mongodb = new MongoClient(process.env.MONGO_URI);
    await mongodb.connect();
    const database = mongodb.db('nest');
    const collection = database.collection('responses');

    return await collection
      .find({ shouldBeAnalysed: true, isAnalysed: false })
      .limit(50)
      .skip(0)
      .toArray();
  } catch (error) {
    console.error('Error retrieving documents:', error);
    throw error;
  }
}

export default getNext50UnprocessedDocuments();
