(function () {

  class FluxDebugService {
    constructor (fluxHelperService) {
      this.fluxHelperService = fluxHelperService
    }

    enhance () {

      const observerHandler = {
        get(target, key) {
          if (typeof target[key] === 'object' && target[key] !== null) {
            return new Proxy(target[key], observerHandler)
          } else {
            return target[key]
          }
        },
        set(target, key, value) {
          console.error(`You are mutating the property ${key} of store state. You should not mutate store directly, please verify that you do not have two-way binding set to the state.`)
          target[key] = value
          return true
        },
      }

      return (createStore) => (reducer, preloadedState, enhancer) => {
        return createStore(this.fluxHelperService.reduceReducers(
          reducer,
          (state = {}) => {
            return new Proxy(state, observerHandler)
          },
        ), preloadedState, enhancer)
      }
    }
  }

  angular
    .module('app.shared.fluxDebug')
    .service('fluxDebugService', FluxDebugService)
})()