let currentTooltip = null
// eslint-disable-next-line no-unused-vars
let currentElement = null
let hideTimer = null

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
    el._tooltip = tooltipEl

    const showTooltip = (e) => {
      if (!binding.value) return

      if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = null
      }

      if (currentTooltip && currentTooltip !== tooltipEl) {
        currentTooltip.style.display = 'none'
      }

      currentTooltip = tooltipEl
      currentElement = el

      tooltipEl.style.visibility = 'hidden'
      tooltipEl.style.display = 'block'

      let left = e.pageX + 10
      let top = e.pageY + 10
      const tooltipRect = tooltipEl.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft
      const scrollY = window.pageYOffset || document.documentElement.scrollTop

      // 防止超出右邊界
      if (left + tooltipRect.width > viewportWidth + scrollX) {
        left = e.pageX - tooltipRect.width - 10
      }
      // 防止超出左邊界
      if (left < scrollX) {
        left = scrollX + 10
      }
      // 防止超出下邊界
      if (top + tooltipRect.height > viewportHeight + scrollY) {
        top = e.pageY - tooltipRect.height - 10
      }
      // 防止超出上邊界
      if (top < scrollY) {
        top = scrollY + 10
      }

      tooltipEl.style.left = left + 'px'
      tooltipEl.style.top = top + 'px'
      tooltipEl.style.visibility = 'visible'

      // 觸控設備自動隱藏
      if (e.type === 'touchstart') {
        hideTimer = setTimeout(() => {
          hideTooltip()
        }, 2000)
      }
    }

    const hideTooltip = () => {
      if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = null
      }
      tooltipEl.style.display = 'none'
      if (currentTooltip === tooltipEl) {
        currentTooltip = null
        currentElement = null
      }
    }

    // 處理點擊事件 - 使用 capture 階段確保優先執行
    // eslint-disable-next-line no-unused-vars
    const handleClick = (e) => {
      // 延遲執行以確保在其他點擊事件之後
      setTimeout(() => {
        if (currentTooltip === tooltipEl) {
          hideTooltip()
        }
      }, 0)
    }

    //eslint-disable-next-line no-unused-vars
    const handleTouchEnd = (e) => {
      setTimeout(() => {
        if (currentTooltip === tooltipEl) {
          hideTooltip()
        }
      }, 100)
    }

    const globalHideHandler = (e) => {
      if (currentTooltip === tooltipEl && el !== e.target && !el.contains(e.target)) {
        hideTooltip()
      }
    }

    // 桌面事件
    el.addEventListener('mouseenter', showTooltip)
    el.addEventListener('mouseleave', hideTooltip)

    // 觸控事件
    el.addEventListener('touchstart', showTooltip, { passive: true })

    // 點擊和觸控結束時隱藏
    el.addEventListener('click', handleClick)
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    // 全域事件監聽 - 使用 capture 階段
    document.addEventListener('click', globalHideHandler, true)
    document.addEventListener('touchstart', globalHideHandler, { passive: true, capture: true })
    document.addEventListener('scroll', hideTooltip, { passive: true })
    document.addEventListener('resize', hideTooltip)

    // 儲存事件處理器以便清理
    el._showTooltip = showTooltip
    el._hideTooltip = hideTooltip
    el._handleClick = handleClick
    el._handleTouchEnd = handleTouchEnd
    el._globalHideHandler = globalHideHandler
  },

  updated(el, binding) {
    if (el._tooltip) {
      el._tooltip.textContent = binding.value
      if (currentTooltip === el._tooltip && el._tooltip.style.display === 'block') {
        const rect = el.getBoundingClientRect()
        const fakeEvent = {
          pageX: rect.left + rect.width / 2,
          pageY: rect.top + rect.height / 2,
          type: 'update',
        }
        el._showTooltip(fakeEvent)
      }
    }
  },

  unmounted(el) {
    if (el._tooltip) {
      // 移除所有事件監聽器
      el.removeEventListener('mouseenter', el._showTooltip)
      el.removeEventListener('mouseleave', el._hideTooltip)
      el.removeEventListener('touchstart', el._showTooltip)
      el.removeEventListener('click', el._handleClick)
      el.removeEventListener('touchend', el._handleTouchEnd)

      document.removeEventListener('click', el._globalHideHandler, true)
      document.removeEventListener('touchstart', el._globalHideHandler, true)
      document.removeEventListener('scroll', el._hideTooltip)
      document.removeEventListener('resize', el._hideTooltip)

      if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = null
      }

      if (currentTooltip === el._tooltip) {
        currentTooltip = null
        currentElement = null
      }

      if (el._tooltip.parentNode) {
        document.body.removeChild(el._tooltip)
      }

      delete el._tooltip
      delete el._showTooltip
      delete el._hideTooltip
      delete el._handleClick
      delete el._handleTouchEnd
      delete el._globalHideHandler
    }
  },
}
