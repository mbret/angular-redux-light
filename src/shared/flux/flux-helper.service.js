/**
 * @flow
 */
(function () {

  /**
   * Compose reducer functions right to left.
   *
   * @param {...Function} reducers The reducers functions to compose
   * @returns {function} A function obtained by composing the previous reducer with the
   * next one with action passed through the reducers.
   */
  const reduceReducers = (...reducers) => {
    return (state, action) => {
      return reducers.reduce(
        (a, b) => b(a, action),
        state
    );
    };
  };

  /**
   * Composes single-argument functions from right to left. The rightmost
   * function can take multiple arguments as it provides the signature for
   * the resulting composite function.
   *
   * @param {...Function} funcs The functions to compose.
   * @returns {Function} A function obtained by composing the argument functions
   * from right to left. For example, compose(f, g, h) is identical to doing
   * (...args) => f(g(h(...args))).
   */
  const compose = (...funcs) => {
    if (funcs.length === 0) {
      return arg => arg;
    }
    if (funcs.length === 1) {
      return funcs[0];
    }
    return funcs.reduce((a, b) => (...args) => a(b(...args)));
  };

  /**
   * Creates a store enhancer that applies middleware to the dispatch method
   * of the Redux store. This is handy for a variety of tasks, such as expressing
   * asynchronous actions in a concise manner, or logging every action payload.
   *
   * See `redux-thunk` package as an example of the Redux middleware.
   *
   * Because middleware is potentially asynchronous, this should be the first
   * store enhancer in the composition chain.
   *
   * Note that each middleware will be given the `dispatch` and `getState` functions
   * as named arguments.
   *
   * @param {...Function} middlewares The middleware chain to be applied.
   * @returns {Function} A store enhancer applying the middleware.
   */
    // let i = 0
  const applyMiddleware = (...middlewares) => {
    return (createStore, $injector) => (reducer, preloadedState) => {
      const store = createStore(reducer, preloadedState);
      let dispatch = store.dispatch;
      const middlewareAPI = {
          getState: store.getState,
          dispatch: (action) => dispatch(action),
        // $injector: $injector
        };
      let chain = middlewares.map(middleware => middleware(middlewareAPI));
      dispatch = compose(...chain)(store.dispatch);
      return Object.assign({}, store, {
        dispatch
      });
    };
  };

  /**
   * Turns an object whose values are different reducer functions, into a single
   * reducer function. It will call every child reducer, and gather their results
   * into a single state object, whose keys correspond to the keys of the passed
   * reducer functions.
   *
   * @param {Object} reducers An object whose values correspond to different
   * reducer functions that need to be combined into one. One handy way to obtain
   * it is to use ES6 `import * as reducers` syntax. The reducers may never return
   * undefined for any action. Instead, they should return their initial state
   * if the state passed to them was undefined, and the current state for any
   * unrecognized action.
   *
   * @returns {Function} A reducer function that invokes every reducer inside the
   * passed object, and builds a state object with the same shape.
   */
  const combineReducers = (reducers) => {
    const reducerKeys = Object.keys(reducers);
    const finalReducers = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      if (typeof reducers[key] === 'function') {
        finalReducers[key] = reducers[key];
      }
    }
    const finalReducerKeys = Object.keys(finalReducers);

    return function combination (state = {}, action) {
      let hasChanged = false;
      const nextState = {};
      for (let i = 0; i < finalReducerKeys.length; i++) {
        const key = finalReducerKeys[i];
        const reducer = finalReducers[key];
        const previousStateForKey = state[key];
        const nextStateForKey = reducer(previousStateForKey, action);
        nextState[key] = nextStateForKey;
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      }
      return hasChanged ? nextState : state;
    };
  };

  function provider () {
    this.compose = compose;
    this.combineReducers = combineReducers;
    this.reduceReducers = reduceReducers;

    this.$get = ($injector) => {
      'ngInject';
      return {
        /**
         * @see compose
         */
        compose,

        /**
         * @see reduceReducers
         */
        reduceReducers,

        /**
         * @see combineReducers
         */
        combineReducers,

        /**
         * Wrapper for Angular DI
         * @see applyMiddleware
         * @param {...String} middleware Array of injectable middleware
         * @returns {Function} A store enhancer applying the middleware.
         */
        applyMiddleware: (...middleware) => {
        return applyMiddleware(...middleware.map((nameOrInstance) => {
          return typeof nameOrInstance === 'string' ? $injector.get(nameOrInstance) : nameOrInstance;
        }));
      }
    };
    };
  }

  angular
    .module('app.shared.flux')
    .provider('fluxHelperService', provider);
})();