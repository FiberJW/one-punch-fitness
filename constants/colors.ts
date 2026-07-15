// "Hero Training Log" palette — dark manga-paper aesthetic.
export const colors = {
  ink: '#0F0C0C', // app background
  panel: '#1D1717', // elevated surface (cards, sheets, rows)
  panelHigh: '#2A2222', // pressed / borders
  capeWhite: '#F5F1E8', // primary text (warm manga-paper white)
  smoke: 'rgba(245, 241, 232, 0.55)', // secondary text
  faint: 'rgba(245, 241, 232, 0.14)', // hairlines / tracks
  heroYellow: '#FFC93C', // primary accent
  gloveRed: '#E5484D', // stop / destructive / K.O. day
  // Kept for gradient scrims fading art into the app background.
  spotiBlack: '#0F0C0C',
  // --- legacy accents, retired incrementally as screens are reskinned; the
  // dead ones are deleted in the final cleanup pass. ---
  purpp: '#42002F',
  halfWhite: 'rgba(255, 255, 255, 0.5)',
  twentyWhite: 'rgba(255, 255, 255, 0.2)',
  seventyWhite: 'rgba(255, 255, 255, 0.7)',
  offWhite: '#E0E0E0',
  offYellow: '#FFFEEC',
  elevated: '#221C1C',
  elevatedHigh: '#2A2424',
  fortyBlack: 'rgba(0, 0, 0, 0.4)',
  twentyBlack: 'rgba(0, 0, 0, 0.2)',
  halfBlack: 'rgba(0, 0, 0, 0.5)',
  heavenBlue: '#2DBDDA',
  froggo: '#39B822',
  status: '#651FFF',
  start: '#1DE9B6',
  bRED: '#FF5252',
  twentyOnStart: '#61F0CC',
  blueLeftUsTooSoon: '#536DFE',
  disabled: '#9E9E9E',
} as const;
