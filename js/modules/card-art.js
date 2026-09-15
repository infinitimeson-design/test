/*
  card-art.js
  One shared helper for putting a real photo into a .card-art box (used by
  both scenario cards and role cards).

  Sets background-image directly on the element instead of going through a
  CSS custom property. That indirection (--card-image set via JS, read back
  by a rule in an external stylesheet) is a known CSS gotcha: a relative
  url() inside a custom property resolves against the stylesheet that reads
  it, not the page — so a path like "assets/images/x.webp" silently resolved
  to ".../css/components/assets/images/x.webp" and 404'd. Setting
  background-image directly avoids that indirection entirely and resolves
  the path relative to the page, as expected.
*/
export function applyCardArt(artEl, path) {
  if (!artEl || !path) return;
  artEl.style.backgroundImage = `url("${path}")`;
  artEl.style.setProperty('--card-placeholder-opacity', '0');
}
