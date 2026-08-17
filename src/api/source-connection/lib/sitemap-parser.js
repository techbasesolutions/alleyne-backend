'use strict';

/**
 * Parse a sitemap XML string and extract all listing-page URLs.
 * Handles both standard sitemaps and sitemap index files.
 * For sitemap indexes, returns the nested sitemap URLs so the caller can
 * fetch them recursively (the sync-runner handles one level of nesting).
 */
function parseSitemapUrls(xml) {
  const urls = [];
  const locRegex = /<loc>([^<]+)<\/loc>/gi;
  let match;

  while ((match = locRegex.exec(xml)) !== null) {
    const url = match[1].trim();
    if (url) urls.push(url);
  }

  return urls;
}

/** Distinguish sitemap index files (contain nested .xml references) */
function isSitemapIndex(xml) {
  return /<sitemapindex/i.test(xml);
}

module.exports = { parseSitemapUrls, isSitemapIndex };
