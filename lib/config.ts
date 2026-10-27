/** Canonical origin (apex redirects to www). */
export const SITE_URL = "https://www.pipariza.digital";

export const FORMSPREE_ENDPOINT = "https://formspree.io/f/moeqjekg";

export const CONTACT = {
  // The Contacts card leaves the LinkedIn button and row out while this is null.
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/duvan-felipe-colmenares-ariza-22800b258/",
  } as { label: string; href: string } | null,
  instagram: { label: "Instagram", href: "https://instagram.com/pipariza" },
  email: "pipariza27@gmail.com",
  whatsapp: { label: "+57 315 575 8792", href: "https://wa.me/573155758792" },
  city: "Bogotá, Colombia",
};
