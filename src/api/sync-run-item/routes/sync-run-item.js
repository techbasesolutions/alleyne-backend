'use strict';

module.exports = {
  routes: [
    { method: 'GET',    path: '/sync-run-items',     handler: 'sync-run-item.find',    config: {} },
    { method: 'GET',    path: '/sync-run-items/:id', handler: 'sync-run-item.findOne', config: {} },
    { method: 'POST',   path: '/sync-run-items',     handler: 'sync-run-item.create',  config: {} },
    { method: 'PUT',    path: '/sync-run-items/:id', handler: 'sync-run-item.update',  config: {} },
    { method: 'DELETE', path: '/sync-run-items/:id', handler: 'sync-run-item.delete',  config: {} },
  ],
};
