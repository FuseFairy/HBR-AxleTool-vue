// Tooltip manager singleton
class TooltipManager {
  constructor() {
    this.tooltips = new Set()
    this.currentTooltip = null
    this.currentElement = null
    this.hideTimer = null
    this.globalListenersAdded = false
  }

  addTooltip(tooltip) {
    this.tooltips.add(tooltip)
    this.ensureGlobalListeners()
  }

  removeTooltip(tooltip) {
    this.tooltips.delete(tooltip)
    if (this.currentTooltip === tooltip.element) {
      this.hideCurrentTooltip()
    }
    if (this.tooltips.size === 0) {
      this.removeGlobalListeners()
    }
  }

  ensureGlobalListeners() {
    if (!this.globalListenersAdded) {
      document.addEventListener('click', this.handleGlobalClick.bind(this), true)
      document.addEventListener('touchstart', this.handleGlobalTouchStart.bind(this), {
        passive: true,
        capture: true,
      })
      document.addEventListener('scroll', this.handleGlobalScroll.bind(this), { passive: true })
      document.addEventListener('resize', this.handleGlobalResize.bind(this))
      this.globalListenersAdded = true
    }
  }

  removeGlobalListeners() {
    if (this.globalListenersAdded) {
      document.removeEventListener('click', this.handleGlobalClick.bind(this), true)
      document.removeEventListener('touchstart', this.handleGlobalTouchStart.bind(this), true)
      document.removeEventListener('scroll', this.handleGlobalScroll.bind(this))
      document.removeEventListener('resize', this.handleGlobalResize.bind(this))
      this.globalListenersAdded = false
    }
  }

  handleGlobalClick(e) {
    if (this.currentTooltip) {
      const tooltip = this.findTooltipByElement(this.currentElement)
      if (tooltip && tooltip.element !== e.target && !tooltip.element.contains(e.target)) {
        this.hideCurrentTooltip()
      }
    }
  }

  handleGlobalTouchStart(e) {
    if (this.currentTooltip) {
      const tooltip = this.findTooltipByElement(this.currentElement)
      if (tooltip && tooltip.element !== e.target && !tooltip.element.contains(e.target)) {
        this.hideCurrentTooltip()
      }
    }
  }

  handleGlobalScroll() {
    this.hideCurrentTooltip()
  }

  handleGlobalResize() {
    this.hideCurrentTooltip()
  }

  findTooltipByElement(element) {
    for (const tooltip of this.tooltips) {
      if (tooltip.element === element) {
        return tooltip
      }
    }
    return null
  }

  showTooltip(tooltip, e) {
    if (!tooltip.binding.value) return

    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
      this.hideTimer = null
    }

    if (this.currentTooltip && this.currentTooltip !== tooltip.tooltipEl) {
      this.currentTooltip.style.display = 'none'
    }

    this.currentTooltip = tooltip.tooltipEl
    this.currentElement = tooltip.element

    this.positionTooltip(tooltip.tooltipEl, e)

    // Auto-hide for touch devices
    if (e.type === 'touchstart') {
      this.hideTimer = setTimeout(() => {
        this.hideCurrentTooltip()
      }, 2000)
    }
  }

  hideCurrentTooltip() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
      this.hideTimer = null
    }
    if (this.currentTooltip) {
      this.currentTooltip.style.display = 'none'
      this.currentTooltip = null
      this.currentElement = null
    }
  }

  positionTooltip(tooltipEl, e) {
    tooltipEl.style.visibility = 'hidden'
    tooltipEl.style.display = 'block'

    let left = e.pageX + 10
    let top = e.pageY + 10
    const tooltipRect = tooltipEl.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft
    const scrollY = window.pageYOffset || document.documentElement.scrollTop

    // Prevent overflow - right edge
    if (left + tooltipRect.width > viewportWidth + scrollX) {
      left = e.pageX - tooltipRect.width - 10
    }
    // Prevent overflow - left edge
    if (left < scrollX) {
      left = scrollX + 10
    }
    // Prevent overflow - bottom edge
    if (top + tooltipRect.height > viewportHeight + scrollY) {
      top = e.pageY - tooltipRect.height - 10
    }
    // Prevent overflow - top edge
    if (top < scrollY) {
      top = scrollY + 10
    }

    tooltipEl.style.left = left + 'px'
    tooltipEl.style.top = top + 'px'
    tooltipEl.style.visibility = 'visible'
  }
}

// Create singleton instance
const tooltipManager = new TooltipManager()

export default {
  mounted(el, binding) {
    const tooltipEl = document.createElement('div')
    tooltipEl.className = 'tooltip'
    tooltipEl.textContent = binding.value
    tooltipEl.style.cssText = `
      position: absolute;
      background: #2e3951ff;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      display: none;
      z-index: 2000;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(159, 182, 233, 0.5);
      max-width: 300px;
      word-wrap: break-word;
      white-space: normal;
    `
    document.body.appendChild(tooltipEl)

    const tooltip = {
      element: el,
      tooltipEl,
      binding,
    }

    // Store tooltip reference
    el._tooltip = tooltip

    const showTooltip = (e) => {
      tooltipManager.showTooltip(tooltip, e)
    }

    const hideTooltip = () => {
      tooltipManager.hideCurrentTooltip()
    }

    const handleClick = () => {
      setTimeout(() => {
        if (tooltipManager.currentTooltip === tooltipEl) {
          tooltipManager.hideCurrentTooltip()
        }
      }, 0)
    }

    const handleTouchEnd = () => {
      setTimeout(() => {
        if (tooltipManager.currentTooltip === tooltipEl) {
          tooltipManager.hideCurrentTooltip()
        }
      }, 100)
    }

    // Only add local event listeners
    el.addEventListener('mouseenter', showTooltip)
    el.addEventListener('mouseleave', hideTooltip)
    el.addEventListener('touchstart', showTooltip, { passive: true })
    el.addEventListener('click', handleClick)
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    // Store event handlers for cleanup
    tooltip.showTooltip = showTooltip
    tooltip.hideTooltip = hideTooltip
    tooltip.handleClick = handleClick
    tooltip.handleTouchEnd = handleTouchEnd

    // Register tooltip with manager
    tooltipManager.addTooltip(tooltip)
  },

  updated(el, binding) {
    if (el._tooltip) {
      el._tooltip.tooltipEl.textContent = binding.value
      el._tooltip.binding = binding

      if (tooltipManager.currentTooltip === el._tooltip.tooltipEl && el._tooltip.tooltipEl.style.display === 'block') {
        const rect = el.getBoundingClientRect()
        const fakeEvent = {
          pageX: rect.left + rect.width / 2,
          pageY: rect.top + rect.height / 2,
          type: 'update',
        }
        tooltipManager.showTooltip(el._tooltip, fakeEvent)
      }
    }
  },

  unmounted(el) {
    if (el._tooltip) {
      const tooltip = el._tooltip

      // Remove local event listeners
      el.removeEventListener('mouseenter', tooltip.showTooltip)
      el.removeEventListener('mouseleave', tooltip.hideTooltip)
      el.removeEventListener('touchstart', tooltip.showTooltip)
      el.removeEventListener('click', tooltip.handleClick)
      el.removeEventListener('touchend', tooltip.handleTouchEnd)

      // Remove tooltip from DOM
      if (tooltip.tooltipEl.parentNode) {
        document.body.removeChild(tooltip.tooltipEl)
      }

      // Unregister from manager
      tooltipManager.removeTooltip(tooltip)

      delete el._tooltip
    }
  },
}
