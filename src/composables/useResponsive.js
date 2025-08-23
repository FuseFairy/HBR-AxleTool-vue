import { ref, onMounted, onUnmounted } from 'vue'

export function useResponsive(elRef) {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)

  let observer

  const update = (width) => {
    isMobile.value = width < 768
    isTablet.value = width >= 768 && width < 1024
    isDesktop.value = width >= 1024
  }

  onMounted(() => {
    if (elRef.value) {
      observer = new ResizeObserver((entries) => {
        if (entries[0]) {
          update(entries[0].contentRect.width)
        }
      })
      observer.observe(elRef.value)
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return { isMobile, isTablet, isDesktop }
}
