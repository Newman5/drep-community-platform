/**
 * Normalizes the metadata returned from Blockfrost so it always has
 * json_metadata.body.title and body.abstract
 */
export function normalizeMetadata(raw: any): any {
  if (!raw) return null;

  // Some responses already have body.title
  if (raw.body?.title) return raw;

  // Some have title at the top level
  if (raw.title) {
    return {
      ...raw,
      body: {
        title: raw.title,
        abstract: raw.abstract || '',
        ...raw.body,
      },
    };
  }

  // Fallback if title buried deeper or missing
  return {
    ...raw,
    body: {
      title: raw.body?.['@value'] || 'Untitled Proposal',
      ...raw.body,
    },
  };
}
