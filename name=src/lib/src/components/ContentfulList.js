import React, { useEffect, useState } from 'react';
import client from '../lib/contentful';

/**
 * Example component that fetches entries from Contentful client-side (CSR).
 * Props:
 *  - contentType (string): the Contentful content type ID to fetch (default: 'blogPost')
 *  - limit (number): number of entries to fetch
 *
 * Update the rendering to match your content model (fields, images, etc.)
 */
export default function ContentfulList({ contentType = 'blogPost', limit = 10 }) {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    client
      .getEntries({
        content_type: contentType,
        limit,
        order: '-sys.createdAt',
      })
      .then((response) => {
        setItems(response.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Contentful fetch error', err);
        setError(err);
        setLoading(false);
      });
  }, [contentType, limit]);

  if (loading) return <div>Loading content…</div>;
  if (error) return <div>Error loading content.</div>;
  if (!items || items.length === 0) return <div>No content found.</div>;

  return (
    <div>
      {items.map((entry) => {
        const fields = entry.fields || {};
        return (
          <article key={entry.sys.id} style={{ marginBottom: '1.5rem' }}>
            <h2>{fields.title || 'Untitled'}</h2>
            {fields.thumbnail && fields.thumbnail.fields && fields.thumbnail.fields.file && (
              <img
                src={fields.thumbnail.fields.file.url}
                alt={fields.thumbnail.fields.title || ''}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: fields.body || fields.description || '' }} />
          </article>
        );
      })}
    </div>
  );
}
