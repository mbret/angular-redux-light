(function () {

  /**
   * We need to wrap createStore to keep the function clean and usable by enhancer chain functions.
   * This way we can still access angular dependencies and use it.
   * @return {Function} Store enhancer
   */
  const storeFactory = () => {

    /**
     * @description Classic createStore function. This function can be used inside enhancer.
     * @param {Function} reducer -
     * @param {any} preloadedState -
     * @param {Function} enhancer -
     * @returns {Object} Store
     */
    const createStore = (reducer, preloadedState, enhancer) => {
      if (enhancer) {
        // @todo I think $injector may be removed (useless)
        return enhancer(createStore)(reducer, preloadedState);
      }
      let currentState = preloadedState;
      // let isDispatching = false
      let currentReducer = reducer;
      let currentListeners = [];
      let nextListeners = currentListeners;

      function ensureCanMutateNextListeners () {
        if (nextListeners === currentListeners) {
          nextListeners = currentListeners.slice();
        }
      }

      /**
       * Reads the state tree managed by the store.
       *
       * @returns {any} The current state tree of your application.
       */
      function getState () {
        return currentState;
      }

      function dispatch (action) {
        // isDispatching = true
        currentState = currentReducer(currentState, action);
        // isDispatching = false
        currentListeners = nextListeners;
        const listeners = currentListeners;
        for (let i = 0; i < listeners.length; i++) {
          const listener = listeners[i];
          listener();
        }

        return action;
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
          throw new Error('Expected listener to be a function.');
        }

        let isSubscribed = true;

        ensureCanMutateNextListeners();
        nextListeners.push(listener);

        return function unsubscribe () {
          if (!isSubscribed) {
            return;
          }

          isSubscribed = false;

          ensureCanMutateNextListeners();
          const index = nextListeners.indexOf(listener);
          nextListeners.splice(index, 1);
        };
      }

      // When a store is created, an "INIT" action is dispatched so that every
      // reducer returns their initial state. This effectively populates
      // the initial state tree.
      dispatch({type: 'flux/INIT'});

      return {
        subscribe,
        getState,
        dispatch
      };
    };

    return createStore;
  };

  function provider () {
    let options = {};
    this.setOptions = (opt) => {
      options = Object.assign(options, opt);
    };
    this.$get = ($injector) => {
      'ngInject';
      if (!options.reducer || !options.enhancer) {
        throw new Error('[brs-flux] Please verify that you have provided initial reducer / enhancer');
      }
      return storeFactory()(
        $injector.invoke(options.reducer),
        options.preloadedState,
        $injector.invoke(options.enhancer)
      );
    };
  }

  angular
    .module('app.shared.flux')
    .provider('fluxStoreService', provider);
})();