const DISTANCE = 70
const DURATION = 1000
const animationMap = new WeakMap()

const ob = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const animation = animationMap.get(entry.target)
      animation.play()
      ob.unobserve(entry.target)
    }
  }
})

function isBelowViewport(el) {
  const rect = el.getBoundingClientRect()
  return rect.top > window.innerHeight
}

export default {
  mounted(el) {
    if (!isBelowViewport(el)) {
      return
    }
    const animation = el.animate(
      [
        {
          transform: `translateY(${DISTANCE}px)`,
          opacity: 0.5,
        },
        {
          transform: `translateY(0)`,
          opacity: 1,
        },
      ],
      {
        duration: DURATION,
        easing: 'ease',
      }
    )
    animation.pause()
    animationMap.set(el, animation)
    ob.observe(el)
  },
  unmounted(el) {
    ob.unobserve(el)
  },
}
