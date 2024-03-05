import mongoose from 'mongoose';

export const ResponseSchemaName = 'Response';

export const ResponseSchema = new mongoose.Schema({
  id: String,
  content: String,
  score: [Number, null],
  isAnalysed: Boolean,
  shouldBeAnalysed: Boolean,
  date: Date,
  categories: [
    {
      name: String,
      score: [Number, null],
      isAIGenerated: Boolean,
    },
  ],
});
