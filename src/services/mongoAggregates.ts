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
          _id: '$categories.name',
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
          averageScore: { $avg: "$categories.score" },
        },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();

    return result;
  },
});

export default mongoAggregates;
