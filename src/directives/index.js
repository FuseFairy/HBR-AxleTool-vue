import vSlideIn from './vSlideIn'
import vTooltip from './vTooltip'

export default {
  install(app) {
    app.directive('slide-in', vSlideIn)
    app.directive('tooltip', vTooltip)
  },
}
