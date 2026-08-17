'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::favorite.favorite', ({ strapi }) => ({
  /**
   * Find favourites — scoped to the authenticated user via entityService
   * to bypass Strapi's content-API sanitizer, which rejects filters on
   * the users-permissions relation when called with a user JWT.
   */
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const { populate, sort, pagination } = ctx.query;
    const pageSize = Number(pagination?.pageSize ?? 50);
    const page = Number(pagination?.page ?? 1);

    const [entities, total] = await Promise.all([
      strapi.entityService.findMany('api::favorite.favorite', {
        filters: { user: { id: user.id } },
        populate: populate ?? {},
        sort: sort ?? { createdAt: 'desc' },
        pagination: { page, pageSize },
      }),
      strapi.entityService.count('api::favorite.favorite', {
        filters: { user: { id: user.id } },
      }),
    ]);

    const sanitized = await this.sanitizeOutput(entities, ctx);
    return this.transformResponse(sanitized, {
      pagination: { page, pageSize, pageCount: Math.ceil(total / pageSize), total },
    });
  },

  /**
   * Create a favourite — idempotent: returns existing if (user, listing) pair already exists.
   */
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const { listing } = ctx.request.body?.data ?? {};
    if (!listing) return ctx.badRequest('listing is required');

    const listingId = typeof listing === 'object' ? listing.id ?? listing : listing;

    // Check for existing favourite
    const existing = await strapi.entityService.findMany('api::favorite.favorite', {
      filters: { user: user.id, listing: listingId },
      pagination: { limit: 1 },
    });

    if (existing.length > 0) {
      // Return the existing record in standard Strapi format
      return this.transformResponse(existing[0]);
    }

    // Use entityService directly to bypass sanitizeInput (which strips the user relation)
    const entity = await strapi.entityService.create('api::favorite.favorite', {
      data: { user: user.id, listing: listingId },
    });
    return this.transformResponse(entity);
  },

  /**
   * Delete a favourite — only the owning user may delete.
   */
  async delete(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const { id } = ctx.params;
    const fav = await strapi.entityService.findOne('api::favorite.favorite', id, {
      populate: ['user'],
    });

    if (!fav) return ctx.notFound();
    if (fav.user?.id !== user.id) return ctx.forbidden('You can only remove your own favourites.');

    return super.delete(ctx);
  },
}));
