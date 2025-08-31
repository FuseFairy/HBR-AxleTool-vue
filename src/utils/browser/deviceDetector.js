export function isMobile() {
  const hasFinePointer = window.matchMedia && window.matchMedia('(any-pointer: fine)').matches

  return !hasFinePointer
}
