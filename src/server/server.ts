import * as Hapi from 'hapi';
import * as mongoose from 'mongoose';

import {Constants} from '../contants';
import {monitorsRoute} from '../routes/monitors';
import {config} from './config';
import {log} from './log';

mongoose.connect(Constants.MONGODB_CONNECT_URL, {useNewUrlParser: true}, (error: mongoose.Error) => {
  if (error) {
    return log.error(error);
  }
});

const server = new Hapi.Server({
  port: config.port,
});

server.route(monitorsRoute);

server.start()
  .catch((error) => {
    log.error(error);
  }).then(() => {
    console.log(`Server running on port ${config.port}`);
  });
