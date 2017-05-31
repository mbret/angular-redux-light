(function () {

  class FluxDebugService {
    constructor (options, logger, fluxHelperService) {
      this.options = options
      this.fluxHelperService = fluxHelperService
      this.logger = logger
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
        this.logger.info('[flux-debug] Store created!', Object.assign({}, store.getState()))
        return store
      }
    }

    watchReducer (reducer) {
      if (!this.options.watchReducers) {
        return reducer
      }
      return (state, action) => {
        this.logger.info(`[flux-debug] Reducer [${reducer.name}] enter for action [${action.type}]`, state)
        let result = reducer(state, action)
        this.logger.info(`[flux-debug] Reducer [${reducer.name}] leave `, result)
        return result
      }
    }
  }

  const provider = function () {
    let options = {
      watchReducers: false,
      getLogger: () => console
    }
    this.setOptions = (opt) => {
      options = Object.assign(options, opt)
    }
    this.$get = (fluxHelperService, $injector) => {
      return new FluxDebugService(options, $injector.invoke(options.getLogger), fluxHelperService)
    }
  }

  angular
    .module('app.shared.fluxDebug')
    .provider('fluxDebugService', provider)
})()