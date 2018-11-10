import * as Hapi from 'hapi';
import * as mongoose from 'mongoose';

import {Constants} from '../contants';
import {config} from './config';
import {log} from './log';
import {routes} from './routes';

mongoose.connect(Constants.MONGODB_CONNECT_URL, {useNewUrlParser: true}, (error: mongoose.Error) => {
  if (error) {
    return log.error(error);
  }
});

const server = new Hapi.Server({
  port: config.port,
});

server.route(routes);

server.start()
  .catch((err) => {
    log.error(err);
  }).then((idk) => {
    console.log(`Server running on port ${config.port}`);
  });
