import * as mongoose from 'mongoose';

export const AgentSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  name: String,
  key: String,
});
