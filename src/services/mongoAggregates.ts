import { MongoClient } from 'mongodb';
import * as process from 'process';

const mongoAggregates = () => ({
  messageCountByCategory: async () => {
    const mongodb = new MongoClient(process.env.MONGO_URI);
    await mongodb.connect();
    const database = mongodb.db('nest');
    const collection = database.collection('responses');

    const pipeline = [
      {
        $unwind: '$categories',
      },
      {
        $group: {
          _id: '$categories.type',
          count: { $sum: 1 },
        },
      },
    ];

    return await collection.aggregate(pipeline).toArray();
  },

  averagesByCategory: async () => {
    const mongodb = new MongoClient(process.env.MONGO_URI);
    await mongodb.connect();
    const database = mongodb.db('nest');
    const collection = database.collection('responses');

    const pipeline = [
      {
        $unwind: '$categories',
      },
      {
        $group: {
          _id: '$categories.type',
          averageScore: { $avg: '$categories.score' },
        },
      },
    ];

    return await collection.aggregate(pipeline).toArray();
  },

  messagesByScoresAndCategory: async (scores: number[], category: string) => {
    const mongodb = new MongoClient(process.env.MONGO_URI);
    await mongodb.connect();
    const database = mongodb.db('nest');
    const collection = database.collection('responses');

    const pipeline = [
      {
        $unwind: '$categories',
      },
      {
        $match: {
          'categories.name': category,
          'categories.score': { $in: scores },
          'shouldBeAnalysed': true
        },
      },
      {
        $project: {
          _id: 0,
          content: 1
        }
      }
    ];

    return await collection.aggregate(pipeline).toArray();
  },
});

export default mongoAggregates;
