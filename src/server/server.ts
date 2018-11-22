import * as Hapi from 'hapi';
import * as hjwt from 'hapi-auth-jwt2';
import * as mongoose from 'mongoose';

import {Document} from 'mongoose';
import {Constants} from '../contants';
import {monitorsRoute} from '../routes/monitors';
import {AgentSchema} from '../schemas/Agents';
import {config} from './config';
import {log} from './log';

interface IAgent extends Document {
  name: string;
  key: string;
}

mongoose.connect(Constants.MONGODB_CONNECT_URL, {useNewUrlParser: true}, (error: mongoose.Error) => {
  if (error) {
    return log.error(error);
  }
});

const Agent = mongoose.model('agent', AgentSchema);

const validate = async (decoded: IAgent, request: Request) => {
  let isValid = false;

  await Agent.findOne({_id: decoded._id})
    .exec()
    .catch((error) => {
      log.error(error);
    })
    .then((document) => {
      if (document) {
        isValid = true;

        return {isValid, document};
      }
    });

  return {isValid};
};

const start = async () => {
  const server = new Hapi.Server({
    port: config.port,
  });

  await server.register(hjwt);

  server.auth.strategy('jwt', 'jwt', {key: process.env.SECRET, validate,
    verifyOptions: {algorithms: ['HS256']}});

  server.auth.default('jwt');

  server.route(monitorsRoute);

  await server.start();
};

start()
  .catch((error) => {
    log.error(error.toString());
  }).then(() => {
    console.log(`Server running on port ${config.port}`);
  });
