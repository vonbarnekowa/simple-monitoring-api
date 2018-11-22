import * as monitors from '../controllers/monitors';

export const monitorsRoute = [{
  method: 'GET',
  path: '/monitors/all',
  handler: monitors.getAll,
  options: {auth: 'jwt'},
}, {
  method: 'GET',
  path: '/monitors/{id}',
  handler: monitors.getById,
  options: {auth: 'jwt'},
}, {
  method: 'POST',
  path: '/monitors/{id}/feedback/add',
  handler: monitors.addFeedback,
  options: {auth: 'jwt'},
}];
