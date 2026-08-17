'use strict';

/**
 * Sprint 40: Alert dispatch lifecycle hook.
 * Fires when a CanonicalListing transitions to status=active (including via sync runner),
 * calling the frontend /api/dispatch-alerts endpoint to trigger saved search email alerts.
 */
module.exports = {
  async afterUpdate(event) {
    const { result, params } = event;

    // Only fire when the update explicitly sets status to 'active'
    if (params.data?.status !== 'active') return;
    if (!result?.slug) return;

    const frontendUrl = (process.env.FRONTEND_URL || 'https://realtlist.com').replace(/\/$/, '');
    const secret = process.env.INTERNAL_DISPATCH_SECRET;

    if (!secret) {
      strapi.log.warn('[alerts] INTERNAL_DISPATCH_SECRET not set — skipping alert dispatch');
      return;
    }

    try {
      const res = await fetch(`${frontendUrl}/api/dispatch-alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Dispatch-Secret': secret,
        },
        body: JSON.stringify({ slug: result.slug }),
      });
      if (!res.ok) {
        strapi.log.warn(`[alerts] dispatch-alerts returned ${res.status} for slug=${result.slug}`);
      }
    } catch (err) {
      strapi.log.warn(`[alerts] dispatch-alerts fetch failed for slug=${result.slug}: ${err.message}`);
    }
  },
};
