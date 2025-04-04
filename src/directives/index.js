import vSlideIn from './vSlideIn'

export default {
  install(app) {
    app.directive('slide-in', vSlideIn)
  },
}
