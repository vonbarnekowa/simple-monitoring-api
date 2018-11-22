import * as boom from 'boom';
import * as hapi from 'hapi';
import * as mongoose from 'mongoose';
import * as Slack from 'typed-slack'

import {ObjectID} from 'bson';
import {Document} from 'mongoose';
import {Constants} from '../contants';
import {MonitorSchema} from '../schemas/Monitors';
import {log} from '../server/log';

interface IFeedback {
  date: Date;
  is_up: boolean;
  agent_id: ObjectID;
}

interface IMonitor extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  name: string;
  is_public: boolean;
  address: string;
  frequency: number;
  status: number;
  feedbacks: [IFeedback];
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
        checkForSlackNotification(monitor as IMonitor, payload.is_up);
        (monitor as IMonitor).feedbacks.push({date: payload.date, is_up: payload.is_up,
          agent_id: (request.auth.credentials as Document)._id});
        (monitor as IMonitor).status = (payload.is_up ? 0 : 2);
        monitor.save();
        return monitor;
      } else {
        throw boom.badData(Constants.NO_MONITOR);
      }
    });
};

const checkForSlackNotification = (monitor: IMonitor, is_up: boolean) => {
  if (monitor.status != (is_up ? 0 : 2)) {
    let slack = new Slack.IncomingWebhook(process.env.SLACK_KEY);
    slack.send({ text: monitor.name + ' (' + monitor.address + ') ' + ' is ' + (is_up ? 'up' : 'down')})
      .then((error: Error) => {
        if (error) {
          log.error(error)
        }
      }).catch((error: Error) => {
        if (error) {
          log.error(error)
        }
    });
  }
};
