'use strict';

const CORE_BLOCKLIST = [
  'cariblist.com',
  'barbadospropertysearch.com',
  'realtor.com',
  'zillow.com',
  'airbnb.com',
  'booking.com',
  'vrbo.com',
  'tripadvisor.com',
  'rightmove.co.uk',
  'zoopla.co.uk',
];

/**
 * Normalises a raw domain input to a bare hostname (no protocol, no trailing slash, lowercase).
 */
function normaliseDomain(input) {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  return d;
}

/**
 * Returns { blocked: true, reason } if the domain is on the core hardcoded blocklist
 * or the admin-configured BlockedDomain table.
 * Returns { blocked: false } if the domain is allowed.
 */
async function isDomainBlocked(rawDomain) {
  const domain = normaliseDomain(rawDomain);

  // Layer 1 — hardcoded core blocklist
  if (CORE_BLOCKLIST.includes(domain)) {
    return { blocked: true, reason: 'core_blocklist' };
  }

  // Layer 2 — admin-configurable BlockedDomain table
  try {
    const results = await strapi.entityService.findMany('api::blocked-domain.blocked-domain', {
      filters: { domain },
      limit: 1,
    });
    if (results.length > 0) {
      return { blocked: true, reason: results[0].domainType ?? 'admin_blocklist' };
    }
  } catch (e) {
    strapi.log.warn(`domain-classifier: DB lookup failed for ${domain}: ${e.message}`);
  }

  return { blocked: false };
}

module.exports = { isDomainBlocked, normaliseDomain };
