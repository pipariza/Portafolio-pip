/**
 * The soft desktop wallpaper shared by the light pages (Home, About, Contact): three
 * radial glows over a diagonal gradient, the same stack the Work projects use.
 * `colors` are the top-left glow, the middle one and the bottom-right glow.
 */
export function wallpaperStyle([a, b, c]: readonly [string, string, string]) {
  return {
    background: `radial-gradient(900px 600px at 18% 8%, ${a}, transparent 70%), radial-gradient(1000px 700px at 92% 96%, ${c}, transparent 65%), radial-gradient(700px 500px at 60% 40%, ${b}, transparent 70%), linear-gradient(135deg, ${a}, ${c})`,
  };
}
