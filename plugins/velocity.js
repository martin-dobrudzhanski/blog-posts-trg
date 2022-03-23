import velocity from 'velocity-animate/velocity.min.js'

export default (ctx, inject) => {
  ctx.$velocity = velocity
  inject('velocity', velocity)
}
