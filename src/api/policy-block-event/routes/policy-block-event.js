'use strict';

module.exports = {
  routes: [
    { method: 'GET',    path: '/policy-block-events',     handler: 'policy-block-event.find',    config: {} },
    { method: 'GET',    path: '/policy-block-events/:id', handler: 'policy-block-event.findOne', config: {} },
    { method: 'POST',   path: '/policy-block-events',     handler: 'policy-block-event.create',  config: {} },
    { method: 'PUT',    path: '/policy-block-events/:id', handler: 'policy-block-event.update',  config: {} },
    { method: 'DELETE', path: '/policy-block-events/:id', handler: 'policy-block-event.delete',  config: {} },
  ],
};
