import * as mongoose from 'mongoose';

export const PhrasesSchema = new mongoose.Schema({
  title: {
    type: String,
    index: true,
    unique: true,
  },
  cover: String,
  suggested: Boolean,
  phrases: [
    new mongoose.Schema({
      text: String,
    }),
  ],
});
