export function compareVersions(v1, v2) {
  const parts1 = String(v1 || '0')
    .split('.')
    .map(Number)
  const parts2 = String(v2 || '0')
    .split('.')
    .map(Number)
  const len = Math.max(parts1.length, parts2.length)
  for (let i = 0; i < len; i++) {
    const p1 = parts1[i] || 0
    const p2 = parts2[i] || 0
    if (p1 > p2) return 1
    if (p1 < p2) return -1
  }
  return 0
}
