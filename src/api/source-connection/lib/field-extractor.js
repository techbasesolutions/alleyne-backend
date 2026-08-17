'use strict';

function extractJsonLd(html) {
  const blocks = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const block of blocks) {
    try {
      const content = block.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
      const parsed = JSON.parse(content);
      return parsed;
    } catch { /* skip */ }
  }
  return null;
}

function extractMeta(html, ...names) {
  for (const name of names) {
    const m = html.match(
      new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')
    ) || html.match(
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, 'i')
    );
    if (m) return m[1].trim();
  }
  return null;
}

function extractTitle(html, jsonLd) {
  if (jsonLd?.name) return String(jsonLd.name).trim();
  const og = extractMeta(html, 'og:title');
  if (og) return og;
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].trim() : null;
}

function extractDescription(html, jsonLd) {
  if (jsonLd?.description) return String(jsonLd.description).slice(0, 2000);
  return extractMeta(html, 'og:description', 'description') || null;
}

function extractPrice(html, jsonLd) {
  if (jsonLd?.offers?.price) {
    const raw = parseFloat(String(jsonLd.offers.price).replace(/[^0-9.]/g, ''));
    return { display: String(jsonLd.offers.price), minor: isNaN(raw) ? null : Math.round(raw * 100) };
  }
  if (jsonLd?.price) {
    const raw = parseFloat(String(jsonLd.price).replace(/[^0-9.]/g, ''));
    return { display: String(jsonLd.price), minor: isNaN(raw) ? null : Math.round(raw * 100) };
  }
  // Pattern match: "$450,000" or "BBD 850,000" or "US$1,200,000"
  const m = html.match(/(?:BBD|USD|US\$|\$)\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (m) {
    const raw = parseFloat(m[1].replace(/,/g, ''));
    return { display: `${m[0].trim()}`, minor: isNaN(raw) ? null : Math.round(raw * 100) };
  }
  return null;
}

function extractBedsBaths(html, jsonLd) {
  const beds = jsonLd?.numberOfBedrooms ?? jsonLd?.numberOfRooms ?? null;
  const baths = jsonLd?.numberOfBathroomsTotal ?? jsonLd?.numberOfBathrooms ?? null;

  if (beds !== null) {
    return { bedrooms: parseInt(beds) || null, bathrooms: parseInt(baths) || null };
  }

  const bedM = html.match(/(\d+)\s*(?:bed(?:room)?s?|BR)\b/i);
  const bathM = html.match(/(\d+)\s*(?:bath(?:room)?s?|BA)\b/i);
  return {
    bedrooms: bedM ? parseInt(bedM[1]) : null,
    bathrooms: bathM ? parseInt(bathM[1]) : null,
  };
}

function extractAddress(html, jsonLd) {
  if (jsonLd?.address) {
    const a = jsonLd.address;
    if (typeof a === 'string') return a;
    return [a.streetAddress, a.addressLocality, a.addressRegion].filter(Boolean).join(', ');
  }
  return extractMeta(html, 'og:street-address') || null;
}

function inferTransactionType(html, url) {
  const text = (html + url).toLowerCase();
  if (/for[\s-]?rent|long[\s-]?term|to[\s-]?let|rental/.test(text)) return 'for_rent';
  return 'for_sale';
}

function extractFields(html, url) {
  const jsonLd = extractJsonLd(html);
  const title = extractTitle(html, jsonLd);
  const description = extractDescription(html, jsonLd);
  const price = extractPrice(html, jsonLd);
  const { bedrooms, bathrooms } = extractBedsBaths(html, jsonLd);
  const address = extractAddress(html, jsonLd);
  const transactionType = inferTransactionType(html, url);

  return {
    title,
    description: description || null,
    priceDisplay: price?.display || null,
    priceMinor: price?.minor || null,
    bedrooms,
    bathrooms,
    address,
    transactionType,
    propertyCategory: 'residential',
    confidence: title ? 0.8 : 0.3,
  };
}

module.exports = { extractFields };
