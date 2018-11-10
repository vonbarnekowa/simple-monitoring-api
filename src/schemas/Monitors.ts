import * as mongoose from 'mongoose';

import {FeedbackSchema} from './Feedbacks';

export const MonitorSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  name: String,
  is_public: Boolean,
  address: String,
  frequency: Number,
  status: Number,
  feedbacks: [FeedbackSchema],
});
