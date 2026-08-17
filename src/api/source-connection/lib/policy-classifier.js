'use strict';

const SHORT_TERM_URL_PATTERNS = [
  '/vacation', '/holiday', '/short-stay', '/short_stay', '/nightly',
  '/book-now', '/book_now', '/stay/', '/villa-rental', '/airbnb', '/vrbo',
  '/short-term', '/short_term', '/weekly-rental', '/daily-rental',
  '/holiday-let', '/holiday_let',
];

const SHORT_TERM_CONTENT_SIGNALS = [
  'per night', 'nightly rate', '/night', 'per nite',
  'minimum stay', 'min stay', 'min. stay',
  'check-in date', 'check-out date', 'checkin', 'checkout',
  'availability calendar', 'booking calendar',
  'sleeps ', 'maximum guests', 'max guests', 'number of guests',
  'instant book', 'request to book',
  'vacation rental', 'holiday rental', 'holiday let',
  'short-term rental', 'short term rental',
  'nightly rental', 'weekly rental',
];

const SHORT_TERM_SCHEMA_TYPES = [
  'LodgingBusiness', 'VacationRental', 'BedAndBreakfast', 'Hostel', 'Hotel',
];

function classifyUrl(url, enforceShortTermBlock = true) {
  if (!enforceShortTermBlock) {
    return { decision: 'allow_import', reasonCode: null, confidence: 1.0 };
  }

  const lowerUrl = url.toLowerCase();

  for (const pattern of SHORT_TERM_URL_PATTERNS) {
    if (lowerUrl.includes(pattern)) {
      return { decision: 'block_short_term', reasonCode: `url_pattern:${pattern}`, confidence: 0.9 };
    }
  }

  return { decision: 'allow_import', reasonCode: null, confidence: 0.8 };
}

function classifyContent(html, enforceShortTermBlock = true) {
  if (!enforceShortTermBlock) {
    return { decision: 'allow_import', reasonCode: null, confidence: 1.0 };
  }

  const lowerHtml = html.toLowerCase();

  // Check JSON-LD schema type
  const jsonLdBlocks = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const block of jsonLdBlocks) {
    try {
      const content = block.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
      const parsed = JSON.parse(content);
      const types = [].concat(parsed['@type']).filter(Boolean);
      for (const t of types) {
        if (SHORT_TERM_SCHEMA_TYPES.includes(t)) {
          return { decision: 'block_short_term', reasonCode: `schema_type:${t}`, confidence: 0.95 };
        }
      }
    } catch { /* skip malformed JSON-LD */ }
  }

  // Count content keyword signals — block on ≥2 matches
  const matched = [];
  for (const signal of SHORT_TERM_CONTENT_SIGNALS) {
    if (lowerHtml.includes(signal)) {
      matched.push(signal);
      if (matched.length >= 2) {
        return {
          decision: 'block_short_term',
          reasonCode: `content_signals:${matched.slice(0, 3).join(',')}`,
          confidence: Math.min(0.7 + matched.length * 0.05, 0.95),
        };
      }
    }
  }

  return { decision: 'allow_import', reasonCode: null, confidence: 0.8 };
}

module.exports = { classifyUrl, classifyContent };
