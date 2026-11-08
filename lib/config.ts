/** Canonical origin (apex redirects to www). */
export const SITE_URL = "https://www.pipariza.digital";

/**
 * "Pip Ariza" is the name Pip works under and goes first everywhere; the full name appears
 * where it matters (the CV, the contact card, About, search data).
 */
export const NAME = {
  alias: "Pip Ariza",
  full: "Duvan Felipe Colmenares Ariza",
};

/**
 * The music player of the home (YouTube). Fill in ONE of these and the Music widget replaces the clock:
 * the id of a playlist (the part after "list=" in its link) or the ids of some videos (the part after "v=").
 * While both are empty the home keeps the clock.
 */
export const MUSIC: { playlistId: string | null; videoIds: string[] } = {
  playlistId: null,
  videoIds: [],
};

export const FORMSPREE_ENDPOINT ="https://formspree.io/f/moeqjekg";

export const CONTACT = {
  // The Contacts card leaves the LinkedIn button and row out while this is null.
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/duvancolmenares",
  } as { label: string; href: string } | null,
  instagram: { label: "Instagram", href: "https://instagram.com/pipariza" },
  email: "pipariza27@gmail.com",
  whatsapp: { label: "+57 315 575 8792", href: "https://wa.me/573155758792" },
  city: "Bogotá, Colombia",
};
