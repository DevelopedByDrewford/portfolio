// Firestore-backed content for the Home page — defaults double as the shape
// of the document at content/home, and as a fallback before the first read.
export const HOME_CONTENT_DEFAULTS = {
  heroLede: "I build commerce, search, and gaming experiences on the web — " +
    "currently shipping at Athos Commerce. I care about CI/CD, engaging teams, " +
    "and design that respects the user.",
  resumeUrl: '',
  working: {
    title: 'Software Engineer',
    label: 'Athos Commerce',
    link: 'https://athoscommerce.com',
  },
  reading: 'Kiese Laymon, Jaime Sabines, and Stephen King',
  watching: 'I Love Boosters, The Drama, Obsession',
  listening: 'Ari Lennox, Tyler, the Creator, Orion Sun',
}
