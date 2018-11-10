import * as mongoose from 'mongoose';

export const FeedbackSchema = new mongoose.Schema({
  date: Date,
  is_up: Boolean,
  agent_id: mongoose.Schema.Types.ObjectId,
});
