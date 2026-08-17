'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::saved-search.saved-search', ({ strapi }) => ({
  /**
   * Find saved searches — scoped to the authenticated user via entityService
   * to bypass Strapi's content-API sanitizer, which rejects filters on
   * the users-permissions relation when called with a user JWT.
   */
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const { populate, sort, pagination } = ctx.query;
    const pageSize = Number(pagination?.pageSize ?? 100);
    const page = Number(pagination?.page ?? 1);

    const [entities, total] = await Promise.all([
      strapi.entityService.findMany('api::saved-search.saved-search', {
        filters: { user: { id: user.id } },
        populate: populate ?? {},
        sort: sort ?? { createdAt: 'desc' },
        pagination: { page, pageSize },
      }),
      strapi.entityService.count('api::saved-search.saved-search', {
        filters: { user: { id: user.id } },
      }),
    ]);

    const sanitized = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitized, {
      pagination: { page, pageSize, pageCount: Math.ceil(total / pageSize), total },
    });
  },

  /**
   * Create a saved search — forces user to the authenticated user.
   * Uses entityService.create directly to bypass sanitizeInput, which strips
   * the `user` relation field for Authenticated role requests.
   */
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const body = ctx.request.body?.data ?? {};

    try {
      const entity = await strapi.entityService.create('api::saved-search.saved-search', {
        data: {
          name: body.name,
          filtersJson: body.filtersJson,
          alertEnabled: body.alertEnabled ?? false,
          user: user.id,
        },
      });
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      return ctx.internalServerError(err.message);
    }
  },

  /**
   * Delete a saved search — only the owning user may delete.
   * Orphaned records (user === null) may be deleted by any authenticated user
   * so they can be cleaned up from the dashboard.
   */
  async delete(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const { id } = ctx.params;
    const saved = await strapi.entityService.findOne('api::saved-search.saved-search', id, {
      populate: ['user'],
    });

    if (!saved) return ctx.notFound();
    if (saved.user?.id && saved.user.id !== user.id) {
      return ctx.forbidden('You can only delete your own saved searches.');
    }

    return super.delete(ctx);
  },

  /**
   * Update a saved search — only the owning user may update.
   * Orphaned records (user === null) may be updated by any authenticated user.
   */
  async update(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const { id } = ctx.params;
    const saved = await strapi.entityService.findOne('api::saved-search.saved-search', id, {
      populate: ['user'],
    });

    if (!saved) return ctx.notFound();
    if (saved.user?.id && saved.user.id !== user.id) {
      return ctx.forbidden('You can only update your own saved searches.');
    }

    return super.update(ctx);
  },
}));
