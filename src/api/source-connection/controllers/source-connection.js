'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const dns = require('dns').promises;
const { runSync } = require('../lib/sync-runner');
const { isDomainBlocked, normaliseDomain } = require('../lib/domain-classifier');

const SYNC_RATE_LIMIT_HOURS = 4;

module.exports = createCoreController('api::source-connection.source-connection', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('You must be logged in to create a source connection.');

    const rawDomain = ctx.request.body?.data?.domain ?? '';
    const domain = normaliseDomain(rawDomain);

    // Blocklist check (layer 1: hardcoded + layer 2: admin DB)
    const blockResult = await isDomainBlocked(domain);
    if (blockResult.blocked) {
      return ctx.badRequest(
        'This domain is not eligible for import. It has been identified as an aggregator or portal. Only agent and agency origin sites are supported.'
      );
    }

    ctx.request.body.data.domain = domain;
    ctx.request.body.data.owner = user.id;
    ctx.request.body.data.verificationToken = require('crypto').randomBytes(16).toString('hex');

    return super.create(ctx);
  },

  async verify(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    const connection = await strapi.entityService.findOne(
      'api::source-connection.source-connection',
      id,
      { populate: ['owner'] }
    );

    if (!connection) return ctx.notFound();
    if (connection.owner?.id !== user.id) return ctx.unauthorized('You can only verify your own connections.');

    const { domain, verificationToken } = connection;
    let verified = false;

    try {
      const records = await dns.resolveTxt(domain);
      const expected = `realtlist-verification=${verificationToken}`;
      verified = records.some(r => r.join('').includes(expected));
    } catch (e) {
      strapi.log.debug(`DNS verification failed for ${domain}: ${e.message}`);
    }

    if (!verified) {
      try {
        const base = domain.startsWith('http') ? domain : `https://${domain}`;
        const resp = await fetch(`${base}/realtlist-verification.txt`, {
          signal: AbortSignal.timeout(10000),
        });
        const text = await resp.text();
        if (text.trim() === verificationToken) verified = true;
      } catch (e) {
        strapi.log.debug(`File verification failed for ${domain}: ${e.message}`);
      }
    }

    if (verified) {
      await strapi.entityService.update('api::source-connection.source-connection', id, {
        data: { verificationStatus: 'verified', active: true },
      });
      return { success: true, message: 'Domain verified successfully.' };
    }

    return ctx.badRequest('Verification failed. Ensure the TXT record or verification file is correctly placed.');
  },

  async triggerSync(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const connection = await strapi.entityService.findOne(
      'api::source-connection.source-connection',
      id,
      { populate: ['owner'] }
    );

    if (!connection) return ctx.notFound();
    if (connection.owner?.id !== user.id) return ctx.unauthorized('You can only sync your own connections.');
    if (connection.verificationStatus !== 'verified') {
      return ctx.badRequest('Domain must be verified before syncing.');
    }

    // Re-sync rate cap: minimum 4 hours between manual syncs
    if (connection.lastSyncAt) {
      const lastSync = new Date(connection.lastSyncAt);
      const nextAllowed = new Date(lastSync.getTime() + SYNC_RATE_LIMIT_HOURS * 60 * 60 * 1000);
      if (new Date() < nextAllowed) {
        ctx.status = 429;
        return {
          error: `Sync rate limit: you can trigger a sync at most once every ${SYNC_RATE_LIMIT_HOURS} hours. Next available: ${nextAllowed.toUTCString()}.`,
          nextAllowedAt: nextAllowed.toISOString(),
        };
      }
    }

    try {
      const result = await runSync(id);
      return { success: true, ...result };
    } catch (e) {
      return ctx.badRequest(`Sync failed: ${e.message}`);
    }
  },
}));
