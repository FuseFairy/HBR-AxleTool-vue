export function getAssetsFile(path) {
  return new URL(`../assets/${path}`, import.meta.url).href
}
