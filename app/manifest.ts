import type { MetadataRoute } from 'next';

const iconEntries = [
  {
    src: '/icon/192',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: '/icon/512',
    sizes: '512x512',
    type: 'image/png',
  },
];

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Ibiza Palooza VI',
    short_name: 'Palooza VI',
    description:
      'Los Cuatro Elementos — 30 July – 2 August · Ibiza / Formentera',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#060F1A',
    theme_color: '#060F1A',
    lang: 'en',
    categories: ['events', 'travel', 'lifestyle'],
    icons: [
      ...iconEntries.map((icon) => ({
        ...icon,
        purpose: 'any' as const,
      })),
      ...iconEntries.map((icon) => ({
        ...icon,
        purpose: 'maskable' as const,
      })),
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'View Schedule',
        short_name: 'Schedule',
        description: 'Open the Ibiza Palooza event schedule.',
        url: '/home#schedule',
        icons: [iconEntries[0]],
      },
      {
        name: 'Open RSVP',
        short_name: 'RSVP',
        description: 'Jump straight to the RSVP section.',
        url: '/home#rsvp',
        icons: [iconEntries[0]],
      },
    ],
  };
}
