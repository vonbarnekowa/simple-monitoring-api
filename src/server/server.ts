import * as Hapi from 'hapi';

import {Constants} from '../contants';
import {config} from './config';
import {log} from './log';
import {routes} from './routes';

const server = new Hapi.Server({
  port: config.port
});

server.route(routes);

server.start()
  .catch((err) => {
    log.error(err);
  }).then((idk) => {
    console.log(`Server running on port ${config.port}`);
  }
);
