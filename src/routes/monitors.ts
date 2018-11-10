import * as monitors from '../controllers/monitors';

export const monitorsRoute = [{
  method: 'GET',
  path: '/monitors/all',
  handler: monitors.getAll,
}, {
  method: 'GET',
  path: '/monitors/{id}',
  handler: monitors.getById,
}, {
  method: 'POST',
  path: '/monitors/{id}/feedback/add',
  handler: monitors.addFeedback,
}];
