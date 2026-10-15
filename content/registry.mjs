/**
 * The content registry — the one place that knows what the client's workbook
 * contains. `content:export` builds the spreadsheet from it, `content:import`
 * reads the spreadsheet back through it, and `content:check` validates
 * content/site.json against it. Add a field here and all three follow.
 *
 * `help` is what the client actually reads while editing, so write it for a
 * restaurant owner, not for a developer.
 */

/** Rows of the "Text" sheet, in the order they appear. */
export const TEXT = [
  { group: 'The restaurant' },
  { path: 'brand.name', label: 'Restaurant name', help: 'The big word at the top of the page, in the menu bar, and in the footer.' },
  { path: 'brand.nameGeorgian', label: 'Name in Georgian', help: 'Shown small on the left of the first screen and in the footer. Leave empty to hide it.', required: false },
  { path: 'brand.tagline', label: 'Tagline', help: 'The italic line directly under the big name.' },
  { path: 'brand.cuisine', label: 'Kind of kitchen', help: 'Used in the footer and under the last photo, e.g. "Modern Georgian Cuisine in Brussels".' },

  { group: 'How people find you' },
  { path: 'address.street', label: 'Street and number', help: 'e.g. Rue Saint-Quentin 29' },
  { path: 'address.city', label: 'City' },
  { path: 'address.country', label: 'Country' },
  { path: 'address.mapsUrl', label: 'Google Maps link', help: 'Open your restaurant in Google Maps, press Share, and paste the link here.' },
  { path: 'contact.instagram', label: 'Instagram username', help: 'Without the @. This is where every "follow" button on the site points.' },
  { path: 'contact.phone', label: 'Phone number', required: false, help: 'Written the way guests should read it, e.g. +32 470 15 51 08. Every "Book a table" button calls this number.' },
  { path: 'contact.email', label: 'Email address', required: false, help: 'Leave empty to hide it; the site writes its own polite line instead.' },
  { path: 'contact.hours', label: 'Opening hours', required: false, multiline: true, help: 'One line per day or group of days — press Alt+Enter inside the cell for a new line. Keep the form "Monday–Friday: 12:00–15:00 and 18:00–00:00" and Google can read the hours too.' },

  { group: 'The menu bar at the top' },
  { path: 'nav.about', label: 'Link 1', help: 'Goes to the About Us section.' },
  { path: 'nav.cuisine', label: 'Link 2', help: 'Goes to the Our Cuisine section.' },
  { path: 'nav.menu', label: 'Link 3', help: 'Goes to the menu.' },
  { path: 'nav.spaces', label: 'Link 4', help: 'Goes to the Spaces section.' },
  { path: 'nav.visit', label: 'Link 5', help: 'Goes to the Visit section.' },
  { path: 'nav.book', label: 'Text on the gold "book" button', help: 'The button calls the phone number above. Shown in the menu bar, on the first screen and under Visit.' },

  { group: 'The first screen' },
  { path: 'hero.h1', label: 'Main heading', help: 'Small, bottom left of the first screen — and the heading Google reads first. e.g. "Georgian Restaurant in Brussels".' },
  { path: 'hero.inscription', label: 'Small word beside the name', help: 'Runs sideways down the left edge, next to the Georgian name.' },
  { path: 'hero.scrollLabel', label: 'Word under the down arrow', help: 'e.g. "discover".' },

  { group: 'Section: About Us' },
  { path: 'story.title', label: 'Heading', emphasis: true },
  { path: 'story.lead', label: 'Large opening sentence', multiline: true },
  { path: 'story.body', label: 'The paragraphs below it', multiline: true, help: 'Leave a completely blank line between paragraphs. Alt+Enter makes a new line inside the cell.' },
  { path: 'story.proverb.ka', label: 'Proverb in Georgian', required: false },
  { path: 'story.proverb.latin', label: 'How the proverb is pronounced', required: false },
  { path: 'story.proverb.gloss', label: 'What the proverb means' },
  { path: 'story.proverb.note', label: 'Small note under the proverb', required: false },

  { group: 'Section: Our Cuisine' },
  { path: 'kitchen.title', label: 'Heading', emphasis: true },
  { path: 'kitchen.lead', label: 'Opening paragraph', multiline: true },
  { path: 'kitchen.note', label: 'Small note beside it', required: false, multiline: true },
  { path: 'kitchen.fireTitle', label: 'Heading of the left list', help: 'e.g. "Signature Dishes". The dishes themselves are on "The kitchen" sheet.' },
  { path: 'kitchen.tableTitle', label: 'Heading of the right list', required: false, help: 'Leave empty to show one heading over both lists.' },

  { group: 'Section: Spaces' },
  { path: 'rooms.title', label: 'Heading', emphasis: true },
  { path: 'rooms.lead', label: 'Opening paragraph', multiline: true },
  { path: 'rooms.note', label: 'Small note beside it', required: false, multiline: true },

  { group: 'Section: the menu' },
  { path: 'menu.title', label: 'Heading', emphasis: true },
  { path: 'menu.lead', label: 'Opening paragraph', multiline: true },
  { path: 'menu.isDraft', label: 'Is the menu still a draft?', type: 'yesno', help: 'YES shows a note saying the dishes and prices are not final.' },
  { path: 'menu.draftNote', label: 'The "still a draft" note', required: false, multiline: true, help: 'Only shown while the answer above is YES.' },
  { path: 'menu.currency', label: 'Currency symbol', help: 'Written in front of every price. e.g. €' },
  { path: 'menu.columns', label: 'Columns of dishes', type: 'choice', options: ['1', '2'], help: 'How many columns the dishes are listed in on a computer screen. Phones always use one.' },

  { group: 'Section: Visit' },
  { path: 'visit.title', label: 'Heading', emphasis: true },
  { path: 'visit.statement', label: 'The large closing words', emphasis: true, multiline: true, help: 'Sits across the photo at the very bottom of the page.' },
  { path: 'visit.followLabel', label: 'Text on the Instagram button' },
  { path: 'visit.mapsLabel', label: 'Text on the maps button' },
  { path: 'visit.mapButton', label: 'Text on the "show the map" button', help: 'The map only loads when a visitor presses this.' },
  { path: 'visit.mapNote', label: 'Small print under the map button', required: false },
  { path: 'visit.label.address', label: 'Word above the address' },
  { path: 'visit.label.hours', label: 'Word above the hours' },
  { path: 'visit.label.phone', label: 'Word above the phone number' },
  { path: 'visit.label.email', label: 'Word above the email' },
  { path: 'visit.pending.hours', label: 'Shown when hours are empty', required: false, help: 'The sentence the site writes instead of the hours, if that cell is ever emptied.' },
  { path: 'visit.pending.phone', label: 'Shown when the phone is empty', required: false },
  { path: 'visit.pending.email', label: 'Shown when the email is empty', required: false },

  { group: 'The footer' },
  { path: 'footer.credit', label: 'Small line at the very bottom' },
  { path: 'footer.backToTop', label: 'Last link in the footer list' },

  { group: 'Text nobody sees on screen' },
  { path: 'seo.title', label: 'Browser tab title', help: 'Also the blue headline on Google.' },
  { path: 'seo.description', label: 'Description for Google', multiline: true, help: 'The grey sentence under the headline in search results. Aim for 150–160 characters.' },
  { path: 'seo.keywords', label: 'Search words', required: false, help: 'Not published anywhere — Google ignores keyword lists. A reference of the phrases to use naturally when writing the text above.' },
  { path: 'a11y.skip', label: 'Skip link', help: 'The first thing a keyboard user reaches.' },
  { path: 'a11y.navSections', label: 'Name of the menu bar' },
  { path: 'a11y.navHome', label: 'Name of the logo link' },
  { path: 'a11y.menuOpen', label: 'Name of the menu button when closed' },
  { path: 'a11y.menuClose', label: 'Name of the menu button when open' },
  { path: 'a11y.bandLabel', label: 'Name of the scrolling Georgian strip' },
  { path: 'a11y.menuTabs', label: 'Name of the menu category buttons' },
  { path: 'a11y.instagram', label: 'Name of the Instagram button', help: 'Write @ where the username should go.' },
];

/** The sheets that hold repeatable rows. The client adds and removes rows freely. */
export const SHEETS = [
  {
    key: 'menu',
    name: 'Menu',
    intro: 'Every dish and drink on the site. Add a row for a new one. To add a whole new category, just type its name in the first column and it appears on the site as a new tab. Only "Category" and "Dish" have to be filled in.',
    columns: [
      { key: 'category', header: 'Category', required: true, width: 22, help: 'Type the same name on every row that belongs together. A new name makes a new tab.' },
      { key: 'categoryKa', header: 'Category in Georgian', width: 20, help: 'Optional. Shown small above the category name.' },
      { key: 'name', header: 'Dish', required: true, width: 34 },
      { key: 'ka', header: 'Dish in Georgian', width: 20, help: 'Optional. Leave empty and the line simply is not shown.' },
      { key: 'text', header: 'Description', width: 60, wrap: true, help: 'Optional.' },
      { key: 'price', header: 'Price', width: 26, help: 'Optional. Write it however you like: 14.50, or 6.50 glass / 30.00 bottle. Do not type the currency symbol.' },
    ],
  },
  {
    key: 'kitchen',
    name: 'The kitchen',
    intro: 'The dishes in the Our Cuisine section, in two lists either side of the photo.',
    columns: [
      { key: 'side', header: 'Which list', required: true, width: 14, choices: ['fire', 'table'], help: 'fire = the left list, table = the right list.' },
      { key: 'latin', header: 'Name', required: true, width: 22 },
      { key: 'ka', header: 'Name in Georgian', width: 20 },
      { key: 'icon', header: 'Little drawing', width: 16, choices: ['skewer', 'bread', 'dumpling', 'walnut', 'qvevri', 'churchkhela', 'flame'], help: 'Pick from the list. Leave empty and a flame is used.' },
      { key: 'text', header: 'Description', required: true, width: 70, wrap: true },
    ],
  },
  {
    key: 'rooms',
    name: 'Spaces',
    intro: 'The spaces of the restaurant, one photo card each. A space without a photo is not shown.',
    columns: [
      { key: 'name', header: 'Space', required: true, width: 22 },
      { key: 'meta', header: 'Type', width: 18, help: 'A small word above the name, e.g. indoor dining.' },
      { key: 'text', header: 'Description', required: true, width: 60, wrap: true },
      { key: 'image', header: 'Photo', width: 20, image: true, help: 'The picture name your developer gives you, e.g. terrace.' },
      { key: 'imageAlt', header: 'Photo description', width: 44, wrap: true, help: 'One short sentence describing what is in the picture.' },
    ],
  },
  {
    key: 'words',
    name: 'Georgian words',
    intro: 'The red strip of Georgian words that scrolls across the page under the first screen.',
    columns: [
      { key: 'ka', header: 'In Georgian', required: true, width: 20 },
      { key: 'latin', header: 'How it is said', required: true, width: 20 },
      { key: 'gloss', header: 'What it means', required: true, width: 46 },
    ],
  },
];

/** The fixed picture slots. Space photos live on the Spaces sheet instead. */
export const IMAGES = [
  { key: 'hero', where: 'The big photo at the very top', help: 'Standing up (taller than wide).' },
  { key: 'story', where: 'Beside About Us', help: 'Standing up.' },
  { key: 'kitchen', where: 'Between the two lists of dishes', help: 'Standing up. Food works best here.' },
  { key: 'close', where: 'At the very bottom, behind "Welcome home"', help: 'Standing up.' },
  { key: 'og', where: 'The preview when the site is shared', help: 'og.jpg — lying down, exactly 1200 × 630. Shown in WhatsApp, Instagram and Facebook.' },
];

/* each field carries the group it sits under, so an error can say which
   "Heading" it means */
let currentGroup = '';
for (const row of TEXT) {
  if (row.group) currentGroup = row.group;
  else row.groupName = currentGroup;
}

export const TEXT_FIELDS = TEXT.filter((r) => r.path);
export const byPath = Object.fromEntries(TEXT_FIELDS.map((f) => [f.path, f]));
