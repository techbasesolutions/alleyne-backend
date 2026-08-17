'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { createCanonicalListing } = require('../../source-connection/lib/sync-runner');

module.exports = createCoreController('api::source-listing.source-listing', ({ strapi }) => ({
  async publish(ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) return ctx.badRequest('Invalid id');

    const sl = await strapi.entityService.findOne('api::source-listing.source-listing', id, {
      populate: ['sourceConnection', 'sourceConnection.agency'],
    });
    if (!sl) return ctx.notFound('SourceListing not found');
    if (sl.reviewStatus === 'approved') return ctx.send({ message: 'Already approved' });

    const fields = sl.rawPayloadJson ?? {};
    const connection = sl.sourceConnection;
    if (!connection) return ctx.badRequest('Missing source connection');

    let canonical = null;
    try {
      canonical = await createCanonicalListing(fields, connection);
    } catch (e) {
      return ctx.internalServerError('Failed to create canonical listing: ' + e.message);
    }

    await strapi.entityService.update('api::source-listing.source-listing', id, {
      data: {
        reviewStatus: 'approved',
        importStatus: 'accepted',
        canonicalListing: canonical ? canonical.id : undefined,
      },
    });

    return ctx.send({ ok: true, canonicalListingId: canonical?.id ?? null });
  },

  async reject(ctx) {
    const id = Number(ctx.params.id);
    if (isNaN(id)) return ctx.badRequest('Invalid id');

    await strapi.entityService.update('api::source-listing.source-listing', id, {
      data: { reviewStatus: 'rejected' },
    });

    return ctx.send({ ok: true });
  },
}));
