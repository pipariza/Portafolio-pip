/** Canonical origin (apex redirects to www). */
export const SITE_URL = "https://www.pipariza.digital";

export const FORMSPREE_ENDPOINT = "https://formspree.io/f/moeqjekg";

export const CONTACT = {
  // Pip's real LinkedIn goes here ({ label: "LinkedIn", href: "https://linkedin.com/in/…" });
  // until then the Contacts card simply leaves that row out.
  linkedin: null as { label: string; href: string } | null,
  instagram: { label: "Instagram", href: "https://instagram.com/pipariza" },
  email: "pipariza27@gmail.com",
  whatsapp: { label: "+57 315 575 8792", href: "https://wa.me/573155758792" },
  city: "Bogotá, Colombia",
};
