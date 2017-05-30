(function () {

  class FluxDebugService {
    constructor (fluxHelperService, fluxDebugLoggerService) {
      this.fluxHelperService = fluxHelperService
      this.fluxDebugLoggerService = fluxDebugLoggerService
    }

    /**
     * Return an enhancer that add new reducers/middleware to help debugging.
     * @returns {*}
     */
    enhance () {
      const emptyEnhancer = (createStore) => (reducer, preloadedState, enhancer) => createStore(reducer, preloadedState, enhancer)
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
          console.trace(`State mutation trace`)
          target[key] = value
          return true
        },
      }

      return (createStore) => (reducer, preloadedState) => {
        let store = createStore(
          // add custom reducer
          this.fluxHelperService.reduceReducers(
            reducer,
            // We apply a last reducer to mutate the store into a proxy and then being
            // able to tracks changes into the store. Ex accidental store mutation.
            (state = {}) => {
              return new Proxy(state, observerHandler)
            },
          ),
          // preloaded state
          preloadedState
        )
        this.fluxDebugLoggerService.info('Store created!', Object.assign({}, store.getState()))
        return store
      }
    }
  }

  angular
    .module('app.shared.fluxDebug')
    .service('fluxDebugService', FluxDebugService)
})()