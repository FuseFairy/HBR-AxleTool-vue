export function isMobile() {
  const ua = navigator.userAgent.toLowerCase()
  return /mobile|android|iphone|ipod|phone|ipad/i.test(ua)
}

export function isIosMobile() {
  const ua = navigator.userAgent.toLowerCase()
  return /mobile|iphone|ipod|ipad/i.test(ua)
}
