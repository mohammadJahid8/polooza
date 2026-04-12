'use client';

import { useState, useEffect } from 'react';
import api from './api';
import { DEFAULT_CONTENT, type SiteContent } from './content';

export function useContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    api
      .get('/api/content')
      .then(({ data }) => {
        if (data?.content) setContent({ ...DEFAULT_CONTENT, ...data.content });
      })
      .catch(() => {
        // Fall back to defaults silently
      });
  }, []);

  return content;
}
