/* ---------- Altifi icon set (design doc 10c.1) ----------
 * One style everywhere: 24px grid, 2px rounded strokes, two tones (stroke = main colour, tint = same colour, light).
 * icon(name, { size, color, label, active })  →  inline SVG string.
 *  - color defaults to currentColor, so an icon follows the text colour of its button.
 *  - label → role="img" + aria-label; without it the icon is decorative (aria-hidden).
 * Emoji are only used inside lesson content now; UI chrome uses these icons. */

type Def = { t?: string; s: string }; // t = tint shapes (filled, light), s = stroke shapes
const D: Record<string, Def> = {
  // navigation
  learn: { t: `<path d="M4.5 4.5c3.5 0 6 .5 7.5 2v13c-1.5-1.5-4-2-7.5-2z"/>`, s: `<path d="M12 6.5C10.5 5 8 4.5 4.5 4.5v13c3.5 0 6 .5 7.5 2 1.5-1.5 4-2 7.5-2v-13c-3.5 0-6 .5-7.5 2z"/><path d="M12 6.5v13"/>` },
  explore: { t: `<circle cx="12" cy="12" r="9"/>`, s: `<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/><circle cx="12" cy="12" r=".4"/>` },
  play: { t: `<path d="M7 8h10a4 4 0 0 1 4 4.2l-.4 3.3a2.5 2.5 0 0 1-4.4 1.3L14.5 15h-5l-1.7 1.8a2.5 2.5 0 0 1-4.4-1.3L3 12.2A4 4 0 0 1 7 8z"/>`, s: `<path d="M7 8h10a4 4 0 0 1 4 4.2l-.4 3.3a2.5 2.5 0 0 1-4.4 1.3L14.5 15h-5l-1.7 1.8a2.5 2.5 0 0 1-4.4-1.3L3 12.2A4 4 0 0 1 7 8z"/><path d="M8 10.5v3.5M6.25 12.25h3.5"/><path d="M15.5 11h.01M17.5 13h.01"/>` },
  me: { t: `<circle cx="12" cy="8" r="4"/><path d="M4.5 20c.8-3.6 3.8-6 7.5-6s6.7 2.4 7.5 6z"/>`, s: `<circle cx="12" cy="8" r="4"/><path d="M4.5 20c.8-3.6 3.8-6 7.5-6s6.7 2.4 7.5 6"/>` },
  settings: { t: `<circle cx="12" cy="12" r="7"/>`, s: `<path d="M12 2.8l1.7 2.4 2.9-.7.7 2.9 2.4 1.7-1.2 2.9 1.2 2.9-2.4 1.7-.7 2.9-2.9-.7L12 21.2l-1.7-2.4-2.9.7-.7-2.9-2.4-1.7L5.5 12 4.3 9.1l2.4-1.7.7-2.9 2.9.7z"/><circle cx="12" cy="12" r="3"/>` },
  // HUD
  flame: { t: `<path d="M12 3c.5 3 3.5 4.5 4.5 7.5A5.5 5.5 0 0 1 12 21a5.5 5.5 0 0 1-5.5-5.5c0-2.5 1.5-4 2.5-5 .3 1.6 1 2.5 2 3 0-3.5-.5-6.5 1-10.5z"/>`, s: `<path d="M12 3c.5 3 3.5 4.5 4.5 7.5A5.5 5.5 0 0 1 12 21a5.5 5.5 0 0 1-5.5-5.5c0-2.5 1.5-4 2.5-5 .3 1.6 1 2.5 2 3 0-3.5-.5-6.5 1-10.5z"/><path d="M12 21a2.3 2.3 0 0 1-2.3-2.3c0-1.5 1.3-2.4 2.3-3.7 1 1.3 2.3 2.2 2.3 3.7A2.3 2.3 0 0 1 12 21z"/>` },
  star: { t: `<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>`, s: `<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>` },
  wallet: { t: `<rect x="3" y="7" width="18" height="13" rx="3"/>`, s: `<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M6 7V6a2 2 0 0 1 2.4-2l8.6 1.7"/><path d="M16.5 11.5H21v4h-4.5a2 2 0 0 1 0-4z"/>` },
  coin: { t: `<circle cx="12" cy="12" r="8.5"/>`, s: `<circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M14.5 9.3c-.5-.7-1.4-1.1-2.5-1.1-1.4 0-2.5.8-2.5 1.9 0 2.6 5 1.3 5 3.9 0 1.1-1.1 1.9-2.5 1.9-1.1 0-2-.4-2.5-1.1"/>` },
  heart: { t: `<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z"/>`, s: `<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z"/>` },
  heartBroken: { t: `<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z"/>`, s: `<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z"/><path d="M12 7.3l-1.6 4 3 1.6-1.4 3.6"/>` },
  // actions
  close: { s: `<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>` },
  back: { s: `<path d="M15 5l-7 7 7 7"/>` },
  chevron: { s: `<path d="M9 5l7 7-7 7"/>` },
  check: { s: `<path d="M5 12.5l4.5 4.5L19 7.5"/>` },
  lock: { t: `<rect x="5" y="10.5" width="14" height="10" rx="3"/>`, s: `<rect x="5" y="10.5" width="14" height="10" rx="3"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2.5"/>` },
  pause: { t: `<rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/>`, s: `<rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/>` },
  playTri: { t: `<path d="M8 5.5v13l10.5-6.5z"/>`, s: `<path d="M8 5.5v13l10.5-6.5z"/>` },
  pencil: { t: `<path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 3L8 18.5z"/>`, s: `<path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 3L8 18.5z"/><path d="M13.5 7l3 3"/>` },
  bell: { t: `<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/>`, s: `<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>` },
  refresh: { s: `<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4v4.5H15"/>` },
  camera: { t: `<path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>`, s: `<path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>` },
  image: { t: `<path d="M3.5 17l5-5.5 4 4 2.5-2.5 5.5 5V17a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2z"/>`, s: `<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 17l5-5.5 4 4 2.5-2.5 5.5 5"/><circle cx="16" cy="9" r="1.5"/>` },
  send: { t: `<path d="M4 12l16-8-6 16-2.5-6.5z"/>`, s: `<path d="M4 12l16-8-6 16-2.5-6.5z"/><path d="M11.5 13.5L20 4"/>` },
  speaker: { t: `<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/>`, s: `<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10"/>` },
  mute: { t: `<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/>`, s: `<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M16 10l4 4M20 10l-4 4"/>` },
  question: { t: `<circle cx="12" cy="12" r="9"/>`, s: `<circle cx="12" cy="12" r="9"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1.1.9-1.1 1.5v.6M12 16.8v.01"/>` },
  info: { t: `<circle cx="12" cy="12" r="9"/>`, s: `<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.01"/>` },
  sparkle: { t: `<path d="M12 3c.8 4.2 2.8 6.2 7 7-4.2.8-6.2 2.8-7 7-.8-4.2-2.8-6.2-7-7 4.2-.8 6.2-2.8 7-7z"/>`, s: `<path d="M12 3c.8 4.2 2.8 6.2 7 7-4.2.8-6.2 2.8-7 7-.8-4.2-2.8-6.2-7-7 4.2-.8 6.2-2.8 7-7z"/><path d="M19 16.5v4M17 18.5h4"/>` },
  bolt: { t: `<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>`, s: `<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>` },
  pin: { t: `<path d="M12 21s-6-5.5-6-10.5a6 6 0 0 1 12 0C18 15.5 12 21 12 21z"/>`, s: `<path d="M12 21s-6-5.5-6-10.5a6 6 0 0 1 12 0C18 15.5 12 21 12 21z"/><circle cx="12" cy="10.5" r="2"/>` },
  deep: { t: `<circle cx="10.5" cy="10.5" r="6"/>`, s: `<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5M8 10.5h5M10.5 8v5"/>` },
  clock: { t: `<circle cx="12" cy="12" r="9"/>`, s: `<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>` },
  target: { t: `<circle cx="12" cy="12" r="9"/>`, s: `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/>` },
  video: { t: `<rect x="3" y="6" width="13" height="12" rx="3"/>`, s: `<rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 10.5l5-3v9l-5-3z"/>` },
  dice: { t: `<rect x="4" y="4" width="16" height="16" rx="4"/>`, s: `<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01"/>` },
  chest: { t: `<path d="M3 10V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2z"/>`, s: `<rect x="3" y="10" width="18" height="10" rx="2"/><path d="M3 10V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2M3 13.5h7M14 13.5h7"/><rect x="10" y="11.5" width="4" height="4.5" rx="1"/>` },
  chestOpen: { t: `<path d="M4 9.5l1-5.5 15 2.5-1 4z"/>`, s: `<rect x="3" y="10" width="18" height="10" rx="2"/><path d="M4 9.5l1-5.5 15 2.5-1 4M3 13.5h18"/><path d="M9 3.5l-1-2M12.5 3l.5-2M16 4.5l1.5-1.5"/>` },
  medal: { t: `<circle cx="12" cy="14.5" r="6"/>`, s: `<path d="M8.5 3l2.2 5.8M15.5 3l-2.2 5.8"/><circle cx="12" cy="14.5" r="6"/><path d="M12 11.5l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z"/>` },
  trophy: { t: `<path d="M7 4h10v5a5 5 0 0 1-10 0z"/>`, s: `<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4.5a2.5 2.5 0 0 0 2.6 3.5M17 6h2.5a2.5 2.5 0 0 1-2.6 3.5M12 14v3M9 20.5h6M9.5 17h5v3.5h-5z"/>` },
  // settings
  globe: { t: `<circle cx="12" cy="12" r="9"/>`, s: `<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z"/>` },
  palette: { t: `<path d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2s-.8-1.6-.8-2.5c0-1 .8-1.5 1.8-1.5h2A4 4 0 0 0 21 11c0-4.4-4-8-9-8z"/>`, s: `<path d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2s-.8-1.6-.8-2.5c0-1 .8-1.5 1.8-1.5h2A4 4 0 0 0 21 11c0-4.4-4-8-9-8z"/><path d="M7.5 11.5h.01M10 7.5h.01M15 7.5h.01"/>` },
  chat: { t: `<path d="M4 5.5h16v10.5H9.5L5 19.5v-3.5H4z"/>`, s: `<path d="M5 5h14a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 16H9.5L5 19.5V16a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 5 5z"/><path d="M8 9.5h8M8 12.5h5"/>` },
  cap: { t: `<path d="M2.5 9.5L12 5l9.5 4.5L12 14z"/>`, s: `<path d="M2.5 9.5L12 5l9.5 4.5L12 14z"/><path d="M6.5 11.5V16c1.5 1.5 3.5 2 5.5 2s4-.5 5.5-2v-4.5M21.5 9.5v5"/>` },
  weather: { t: `<path d="M7 19h10a4 4 0 0 0 .5-8 5 5 0 0 0-9.5 1.5A3.3 3.3 0 0 0 7 19z"/>`, s: `<path d="M7 19h10a4 4 0 0 0 .5-8 5 5 0 0 0-9.5 1.5A3.3 3.3 0 0 0 7 19z"/><path d="M5.5 10.5a3 3 0 0 1 4.6-3.6M7 3.5v1.2M2.8 8.5H4M3.8 5.2l.9.9"/>` },
  potato: { t: `<path d="M6 8c2-4 9-5 12-1.5 2.5 3 1 9-3.5 11.5S5 19 4.8 14.5C4.6 12 5 10 6 8z"/>`, s: `<path d="M6 8c2-4 9-5 12-1.5 2.5 3 1 9-3.5 11.5S5 19 4.8 14.5C4.6 12 5 10 6 8z"/><path d="M9 10h.01M14 9h.01M11.5 14h.01M15.5 13.5h.01"/>` },
  bulb: { t: `<path d="M8.5 15.5a6 6 0 1 1 7 0c-.6.5-1 1.2-1 2h-5c0-.8-.4-1.5-1-2z"/>`, s: `<path d="M8.5 15.5a6 6 0 1 1 7 0c-.6.5-1 1.2-1 2h-5c0-.8-.4-1.5-1-2z"/><path d="M9.5 20.5h5"/>` },
  // finance & places (lessons, domains, background pattern)
  house: { t: `<path d="M4 11L12 4l8 7v8.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/>`, s: `<path d="M4 11L12 4l8 7v8.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M9.5 20.5v-6h5v6"/>` },
  shop: { t: `<path d="M3.5 9.5L5 4.5h14l1.5 5z"/>`, s: `<path d="M3.5 9.5L5 4.5h14l1.5 5a2.8 2.8 0 0 1-5.5 0 2.8 2.8 0 0 1-5.5 0 2.8 2.8 0 0 1-5.5 0z"/><path d="M5 11.5v8.5h14v-8.5M10 20v-5h4v5"/>` },
  chart: { t: `<path d="M4 20V15l3.5-3.5 4 3L20 7v13z"/>`, s: `<path d="M4 4v16h16"/><path d="M7.5 15l4-4.5 3 3L20 7M16 7h4v4"/>` },
  bank: { t: `<path d="M3 9.5L12 4l9 5.5z"/>`, s: `<path d="M3 9.5L12 4l9 5.5zM5 10v7M9.5 10v7M14.5 10v7M19 10v7M3.5 20h17"/>` },
  ship: { t: `<path d="M3 15h18l-2.5 5h-13z"/>`, s: `<path d="M3 15h18l-2.5 5h-13zM6 15v-4h12v4M9 11V8h6v3M12 8V5"/>` },
  piggy: { t: `<path d="M5 12.5a6.5 5.5 0 0 1 11-4l2.5-1.5v3a5 5 0 0 1 1.5 2.5h1.5v3h-2a6 6 0 0 1-2.5 2.5V20h-3v-1.5h-4V20h-3v-2.5A5.5 5.5 0 0 1 5 12.5z"/>`, s: `<path d="M5 12.5a6.5 5.5 0 0 1 11-4l2.5-1.5v3a5 5 0 0 1 1.5 2.5h1.5v3h-2a6 6 0 0 1-2.5 2.5V20h-3v-1.5h-4V20h-3v-2.5A5.5 5.5 0 0 1 5 12.5z"/><path d="M10 7.5h3M15.5 11.5h.01"/>` },
  scale: { t: `<path d="M2.5 13a2.5 2.5 0 0 0 5 0zM16.5 13a2.5 2.5 0 0 0 5 0z"/>`, s: `<path d="M12 4v16M8 20h8M5 7h14M5 7l-2.5 6a2.5 2.5 0 0 0 5 0zM19 7l-2.5 6a2.5 2.5 0 0 0 5 0z"/>` },
  percent: { t: `<circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>`, s: `<path d="M6 18L18 6"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>` },
  banknote: { t: `<rect x="2.5" y="6" width="19" height="12" rx="2"/>`, s: `<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9.5v.01M18 14.5v.01"/>` },
  pie: { t: `<path d="M12 3v9h9a9 9 0 0 0-9-9z"/>`, s: `<path d="M12 3v9h9a9 9 0 0 0-9-9z"/><path d="M19.5 15A8.5 8.5 0 1 1 9 3.6"/>` },
  card: { t: `<rect x="3" y="5.5" width="18" height="13" rx="2.5"/>`, s: `<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M6.5 15h4"/>` },
  wave: { t: `<path d="M3 15c2-3 4-3 6 0s4 3 6 0 4-3 6 0v5H3z"/>`, s: `<path d="M3 10c2-3 4-3 6 0s4 3 6 0 4-3 6 0M3 15c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/>` },
  umbrella: { t: `<path d="M3 12a9 9 0 0 1 18 0z"/>`, s: `<path d="M3 12a9 9 0 0 1 18 0zM12 12v6a2 2 0 0 1-4 0M12 3v.5"/>` },
  tree: { t: `<path d="M12 15a5 5 0 0 1-5-5 5 5 0 0 1 5-7 5 5 0 0 1 5 7 5 5 0 0 1-5 5z"/>`, s: `<path d="M12 21v-6M12 15a5 5 0 0 1-5-5 5 5 0 0 1 5-7 5 5 0 0 1 5 7 5 5 0 0 1-5 5zM12 15l-2.5-2.5M12 13l2-2"/>` },
  doc: { t: `<path d="M6 3h8l4 4v14H6z"/>`, s: `<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 15.5h6M9 9h2"/>` },
  drop: { t: `<path d="M12 3.5s6 6.5 6 10.5a6 6 0 0 1-12 0c0-4 6-10.5 6-10.5z"/>`, s: `<path d="M12 3.5s6 6.5 6 10.5a6 6 0 0 1-12 0c0-4 6-10.5 6-10.5z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>` },
  calc: { t: `<rect x="5" y="3" width="14" height="18" rx="2.5"/>`, s: `<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8 7h8v3H8zM8.5 14h.01M12 14h.01M15.5 14h.01M8.5 17.5h.01M12 17.5h.01M15.5 17.5h.01"/>` },
  rocket: { t: `<path d="M12 3c3 2 5 6 4.5 10.5L14 16h-4l-2.5-2.5C7 9 9 5 12 3z"/>`, s: `<path d="M12 3c3 2 5 6 4.5 10.5L14 16h-4l-2.5-2.5C7 9 9 5 12 3z"/><circle cx="12" cy="9" r="1.8"/><path d="M7.5 13.5L5 16.5l3 .5M16.5 13.5l2.5 3-3 .5M10.5 18.5L12 21l1.5-2.5"/>` },
  sliders: { t: `<circle cx="6" cy="9" r="2"/><circle cx="12" cy="15" r="2"/><circle cx="18" cy="7" r="2"/>`, s: `<path d="M6 4v3M6 11v9M12 4v9M12 17v3M18 4v1M18 9v11"/><circle cx="6" cy="9" r="2"/><circle cx="12" cy="15" r="2"/><circle cx="18" cy="7" r="2"/>` },
  swap: { s: `<path d="M4 8h15l-3.5-3.5M20 16H5l3.5 3.5"/>` },
  basket: { t: `<path d="M3.5 10h17l-2 9.5H5.5z"/>`, s: `<path d="M3.5 10h17l-2 9.5H5.5zM8 10l3-6M16 10l-3-6M9 13.5v3M12 13.5v3M15 13.5v3"/>` },
};

export const ICONS = Object.keys(D);

export function icon(name: string, o: { size?: number; color?: string; label?: string; active?: boolean; tint?: number; cls?: string } = {}) {
  const d = D[name] || D.question;
  const size = o.size || 24, color = o.color || "currentColor";
  const tint = o.tint ?? (o.active === false ? 0 : 0.22);
  const a11y = o.label ? `role="img" aria-label="${o.label.replace(/"/g, "&quot;")}"` : `aria-hidden="true" focusable="false"`;
  return `<svg class="ic${o.cls ? " " + o.cls : ""}" width="${size}" height="${size}" viewBox="0 0 24 24" ${a11y} style="color:${color}">`
    + (d.t && tint ? `<g fill="currentColor" opacity="${tint}">${d.t}</g>` : "")
    + `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d.s}</g></svg>`;
}

/** Fixed brand colours for icons that carry meaning (flame = streak, star = XP…). */
export const IC = { flame: "#F2762E", star: "#E8A700", wallet: "#1E9E62", heart: "#EF4E4E", coin: "#E0A800" };
