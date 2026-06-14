export interface TimelineItem {
  time: string;
  event: string;
  note: string;
}

export interface DayContent {
  element: string;
  emoji: string;
  tabLabel: string;
  name: string;
  subtitle: string;
  date: string;
  photo: { venue: string; time: string };
  /** Cloudinary secure_url of an uploaded highlight video for this day (optional) */
  video?: string;
  timeline: TimelineItem[];
}

export interface DjEntry {
  time: string;
  name: string;
  genre: string;
  tag: string;
}

export interface TransportItem {
  icon: string;
  type: string;
  detail: string;
}

export interface NtkItem {
  icon: string;
  title: string;
  detail: string;
}

export interface ChapterItem {
  num: string;
  location: string;
  title: string;
}

export interface RsvpEvent {
  key: string;
  name: string;
  detail: string;
}

export interface SiteContent {
  hero: {
    tag: string;
    title: string;
    subtitle: string;
    dates: string;
  };
  schedule: {
    noticeBanner: string;
    days: DayContent[];
  };
  music: {
    djs: DjEntry[];
  };
  transport: {
    warningBanner: string;
    items: TransportItem[];
  };
  needToKnow: {
    items: NtkItem[];
  };
  chapters: {
    items: ChapterItem[];
    currentLabel: string;
    currentTitle: string;
    currentSub: string;
  };
  rsvp: {
    introText: string;
    events: RsvpEvent[];
    allergyOptions: string[];
    successTitle: string;
    successText: string;
  };
}

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    tag: 'Chapter VI · Ibiza',
    title: 'PALOOZA',
    subtitle: 'Los Cuatro Elementos',
    dates: '30 July – 2 August · Ibiza / Formentera',
  },
  schedule: {
    noticeBanner:
      "This event is strictly for invited guests only. No plus-ones or additional guests without prior approval from your host. Please speak to Michael directly if you'd like to discuss.",
    days: [
      {
        element: 'tierra', emoji: '🌍', tabLabel: 'Thu 30',
        name: 'Tierra — Earth', subtitle: 'Thursday, 30 July', date: 'Thursday, 30 July',
        photo: { venue: 'A Mi Manera, San Juan', time: 'Thursday · Dinner & Party' },
        timeline: [
          { time: '20:30', event: 'A Mi Manera — Private Takeover', note: 'Secret garden dinner & party · San Juan finca' },
          { time: 'Late',  event: 'DJ Set — Nfrtiti', note: 'Party inside the finca' },
          { time: '02:30', event: 'Close', note: 'Big days ahead — rest up (or go out…)' },
        ],
      },
      {
        element: 'agua', emoji: '🌊', tabLabel: 'Fri 31',
        name: 'Agua — Water', subtitle: 'Friday, 31 July', date: 'Friday, 31 July',
        photo: { venue: 'First Boat Day — Ibiza Lunch + Blue Marlin', time: 'Friday · On the Water' },
        timeline: [
          { time: '11:30',     event: 'Boats Depart', note: "Meet at Marina Ibiza — don't be late" },
          { time: 'Afternoon', event: 'Lunch at Cala Gracioneta', note: '' },
          { time: '19:30',     event: 'Blue Marlin', note: 'Palooza returns…' },
          { time: 'Late',      event: 'Afters', note: 'Location to be confirmed — watch this space, confirm if you are keen…' },
        ],
      },
      {
        element: 'fuego', emoji: '🔥', tabLabel: 'Sat 1',
        name: 'Fuego — Fire', subtitle: 'Saturday, 1 August', date: 'Saturday, 1 August',
        photo: { venue: 'Formentera Boat Day + Private Villa Party', time: 'Saturday · The Fire Night' },
        timeline: [
          { time: '11:00',          event: 'Boats Depart', note: 'Meet at Marina Ibiza' },
          { time: 'Afternoon',      event: 'Lunch at Es Molí del Sal', note: '' },
          { time: '21:45 till 5am', event: 'Private Villa Party', note: 'Villa Location revealed closer to the date' },
          { time: 'Late',           event: 'Khenya & Paede B2B', note: 'Back-to-back headline set' },
        ],
      },
      {
        element: 'aire', emoji: '💨', tabLabel: 'Sun 2',
        name: 'Aire — Air', subtitle: 'Sunday, 2 August', date: 'Sunday, 2 August',
        photo: { venue: 'Jondal Beach', time: 'Sunday · Recovery · till 8pm' },
        timeline: [{ time: '14:30', event: 'Jondal', note: 'Recovery lunch till 8pm' }],
      },
    ],
  },
  music: {
    djs: [
      { time: 'Thu · Late',  name: 'Nfrtiti',              genre: 'DJ Set · A Mi Manera Private Takeover', tag: 'Tierra' },
      { time: 'Fri · 19:30', name: 'Blue Marlin Residents', genre: 'Balearic / Deep House',                tag: 'Agua'   },
      { time: 'Sat · Late',  name: 'Khenya & Paede',        genre: 'B2B · Private Villa · Peak Hour',       tag: 'Fuego'  },
    ],
  },
  transport: {
    warningBanner:
      "Important — please read. Getting around Ibiza can be surprisingly difficult. Taxis and Uber can be very unreliable, especially late at night when demand is high. We strongly recommend grouping together with other guests and arranging private transfers well in advance. Don't leave this to the last minute — it will save you a lot of stress on the night.",
    items: [
      { icon: '⛵', type: 'Boats — Friday & Saturday', detail: 'Departure point: Marina Ibiza\nDeparture time: 11:30am Friday, 11:00am Saturday\nPlease be there 15 minutes early — boats will not wait' },
      { icon: '🚗', type: 'Private Transfers', detail: 'We strongly recommend booking a private driver for the weekend, particularly for late-night returns from Blue Marlin and the villa party.\n\nRecommended: Book in advance through your hotel concierge or contact Michael for a trusted local driver' },
      { icon: '🚕', type: 'Taxis & Apps', detail: 'Cabify and Bolt both operate in Ibiza and are more reliable than street taxis.\n\nDownload before you arrive and set up your account. Pre-book where possible — do not rely on finding a taxi late at night during peak season.' },
      { icon: '✈️', type: 'Airport', detail: 'Ibiza Airport (IBZ) — approx 15–20 mins from town\nArrivals: Aim to land Thursday 30 July in time for 20:30 dinner in the middle of the island\nDepartures: Book flights from Sunday afternoon onward — Jondal runs late' },
    ],
  },
  needToKnow: {
    items: [
      { icon: '⛵', title: 'Boats — Friday & Saturday', detail: 'Depart Marina Ibiza at 11:30am Friday and 11:00am Saturday. Be there 15 minutes early — the boats will not wait. Your designated boats will be sent to you prior to the event.' },
      { icon: '🎉', title: 'Saturday Villa Party', detail: 'Location will be revealed closer to the date. Dress to the fire theme. Khenya & Paede B2B from late. This is a unique night.' },
      { icon: '🔒', title: 'No Plus-Ones', detail: 'This is a strictly private event. No additional guests without prior approval from Michael.' },
      { icon: '🚕', title: 'Transport Warning', detail: 'Taxis and Uber are unreliable late at night in peak season. Pre-book private transfers which is your best option. Cabify and Bolt are otherwise your best bet — download before you arrive.' },
      { icon: '✈️', title: 'Flights', detail: 'Aim to land Thursday 30 July in time for 20:30 dinner in the middle of the island. Book departures from Sunday evening — Jondal runs late.' },
      { icon: '💬', title: 'Questions?', detail: 'Message Michael directly for anything not covered here.' },
      { icon: '📵', title: 'No Social Media', detail: 'Please respect the privacy of all guests. No posting to social media without permission.' },
    ],
  },
  chapters: {
    items: [
      { num: 'I',   location: 'Ibiza',      title: 'The 40th, Where It Began…' },
      { num: 'II',  location: 'Ibiza',      title: 'The Sequel…' },
      { num: 'III', location: 'Ibiza',      title: 'A Tale of Us…' },
      { num: 'IV',  location: 'Formentera', title: 'Quemar Los Barcos…' },
      { num: 'V',   location: 'Ibiza',      title: 'I am the Storm…' },
    ],
    currentLabel: 'Now · Chapter VI',
    currentTitle: 'Los Cuatro Elementos',
    currentSub:   'Time to write the next chapter… · 30 July to 2 August · Ibiza / Formentera',
  },
  rsvp: {
    introText:
      "Please confirm your attendance for each event and let us know about any dietary requirements. This helps with planning and means we can make sure you're looked after at every venue. Once you confirm, you are in…!",
    events: [
      { key: 'soho',       name: 'A Mi Manera — Dinner & Party',           detail: 'Thursday 30 July · 20:30 till late · Secret garden takeover' },
      { key: 'boats-fri',  name: 'Boats + Cala Gracioneta Lunch',           detail: 'Friday 31 July · Depart Marina Ibiza 11:30am' },
      { key: 'bluemarlin', name: 'Blue Marlin',                             detail: 'Friday 31 July · 19:30 till late' },
      { key: 'boats-sat',  name: 'Boats + Es Molí del Sal Lunch',           detail: 'Saturday 1 August · Depart Marina Ibiza 11:00am' },
      { key: 'villa',      name: 'Private Villa Party — Khenya & Paede B2B', detail: 'Saturday 1 August · 21:45 till very late' },
      { key: 'jondal',     name: 'Jondal Recovery Lunch',                   detail: 'Sunday 2 August · 14:30 till 8pm' },
    ],
    allergyOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut allergy', 'Shellfish allergy', 'Halal', 'Kosher', 'None'],
    successTitle: "You're confirmed",
    successText: 'Thank you — we have everything we need. See you in Ibiza.',
  },
};
