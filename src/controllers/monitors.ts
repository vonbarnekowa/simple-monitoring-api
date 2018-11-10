import * as boom from 'boom';
import * as hapi from 'hapi';
import * as mongoose from 'mongoose';

import {ObjectID} from 'bson';
import {MonitorSchema} from '../schemas/Monitors';
import {Constants} from '../contants';
import {Document} from 'mongoose';

interface IFeedback {
  date: Date;
  is_up: boolean;
  agent_id: ObjectID;
}

interface IMonitor extends Document {

  user_id: mongoose.Schema.Types.ObjectId,
  name: String,
  is_public: Boolean,
  address: String,
  frequency: Number,
  status: Number,
  feedbacks: [IFeedback],
}

const Monitor = mongoose.model('monitors', MonitorSchema);

export const getAll = async (request: hapi.Request) => {
  return Monitor.find()
    .exec()
    .catch((error) => {
      throw boom.badImplementation(error.message);
    })
    .then((monitors) => {
      return monitors;
    });
};

export const getById = async (request: hapi.Request) => {
  return Monitor.findOne({_id: request.params.id})
    .exec()
    .catch((error) => {
      throw boom.badImplementation(error.message);
    })
    .then((monitor) => {
      if (monitor) {
        return monitor;
      } else {
        throw boom.badData(Constants.NO_MONITOR);
      }
    });
};

export const addFeedback = async (request: hapi.Request) => {
  const payload = request.payload as IFeedback;
  return Monitor.findOne({_id: request.params.id})
    .exec()
    .catch((error) => {
      throw boom.badImplementation(error.message);
    })
    .then((monitor) => {
      if (monitor) {
        (monitor as IMonitor).feedbacks.push({date: payload.date, is_up: payload.is_up, agent_id: payload.agent_id});
        monitor.save();
        return monitor;
      } else {
        throw boom.badData(Constants.NO_MONITOR);
      }
    });
};
