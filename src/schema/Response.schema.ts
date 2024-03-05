import mongoose from 'mongoose';

export const ResponseSchema = new mongoose.Schema({
  id: String,
  content: String,
  score: [Number, null],
  isAnalysed: Boolean,
  shouldBeAnalysed: Boolean,
  categories: [
    {
      name: String,
      score: {
        type: Number,
        default: null,
      },
      isAIGenerated: Boolean,
    },
  ],
});
