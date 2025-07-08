/* eslint-disable no-undef */
export default {
  install: () => {
    if (typeof EventTarget !== 'undefined') {
      let originalAddEventListener = EventTarget.prototype.addEventListener
      EventTarget.prototype.addEventListener = function (type, fn, capture) {
        if (typeof capture !== 'boolean') {
          capture = capture || {}
          capture.passive = false
        }
        originalAddEventListener.call(this, type, fn, capture)
      }
    }
  },
}
