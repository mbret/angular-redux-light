(function () {

  /**
   * We need to wrap createStore to keep the function clean and usable by enhancer chain functions.
   * This way we can still access angular dependencies and use it.
   */
  const storeFactory = ($log, $injector) => {

    /**
     * Classic createStore function. This function can be used inside enhancer.
     * @param {Function} reducer
     * @param {any} preloadedState
     * @param {Function} enhancer
     * @returns {*}
     */
    const createStore = (reducer, preloadedState, enhancer) => {

      if (enhancer) {
        let enhancerInjected = $injector.invoke(enhancer)
        return enhancerInjected(createStore, $injector)(reducer, preloadedState)
      }

      let currentState = preloadedState
      let isDispatching = false
      let currentReducer = reducer
      let currentListeners = []
      let nextListeners = currentListeners

      function ensureCanMutateNextListeners () {
        if (nextListeners === currentListeners) {
          nextListeners = currentListeners.slice()
        }
      }

      /**
       * Reads the state tree managed by the store.
       *
       * @returns {any} The current state tree of your application.
       */
      function getState () {
        return currentState
      }

      function dispatch (action) {
        isDispatching = true
        currentState = currentReducer(currentState, action)
        isDispatching = false

        const listeners = currentListeners = nextListeners
        for (let i = 0; i < listeners.length; i++) {
          const listener = listeners[i]
          listener()
        }

        return action
      }

      /**
       * Adds a change listener. It will be called any time an action is dispatched,
       * and some part of the state tree may potentially have changed. You may then
       * call `getState()` to read the current state tree inside the callback.
       *
       * You may call `dispatch()` from a change listener, with the following
       * caveats:
       *
       * 1. The subscriptions are snapshotted just before every `dispatch()` call.
       * If you subscribe or unsubscribe while the listeners are being invoked, this
       * will not have any effect on the `dispatch()` that is currently in progress.
       * However, the next `dispatch()` call, whether nested or not, will use a more
       * recent snapshot of the subscription list.
       *
       * 2. The listener should not expect to see all state changes, as the state
       * might have been updated multiple times during a nested `dispatch()` before
       * the listener is called. It is, however, guaranteed that all subscribers
       * registered before the `dispatch()` started will be called with the latest
       * state by the time it exits.
       *
       * @param {Function} listener A callback to be invoked on every dispatch.
       * @returns {Function} A function to remove this change listener.
       */
      function subscribe (listener) {
        if (typeof listener !== 'function') {
          throw new Error('Expected listener to be a function.')
        }

        let isSubscribed = true

        ensureCanMutateNextListeners()
        nextListeners.push(listener)

        return function unsubscribe () {
          if (!isSubscribed) {
            return
          }

          isSubscribed = false

          ensureCanMutateNextListeners()
          const index = nextListeners.indexOf(listener)
          nextListeners.splice(index, 1)
        }
      }

      $log.info('Store created')

      // When a store is created, an "INIT" action is dispatched so that every
      // reducer returns their initial state. This effectively populates
      // the initial state tree.
      dispatch({type: 'flux/INIT'})

      return {
        subscribe,
        getState,
        dispatch
      }
    }

    return createStore
  }

  const provider = function () {
    let options = {}
    this.setOptions = (opt) => {
      options = opt
    }
    this.$get = ($log, $injector) => {
      return storeFactory($log, $injector)(
        $injector.invoke(options.reducer),
        options.preloadedState,
        options.enhancer
      )
    }
  }

  angular
    .module('app.shared.flux')
    .provider('fluxStoreService', provider)
})()