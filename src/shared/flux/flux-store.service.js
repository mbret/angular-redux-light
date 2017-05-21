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
                return enhancer(createStore, $injector)(reducer, preloadedState)
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
                return currentState;
            }

            function dispatch (action) {
                isDispatching = true
                currentState = currentReducer(currentState, action)
                isDispatching = false

                const listeners = currentListeners = nextListeners
                for (let i = 0; i < listeners.length; i++) {
                    const listener = listeners[i]
                    listener();
                }

                console.log("COUCOU", action);
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

            $log.info("Store created");

            // When a store is created, an "INIT" action is dispatched so that every
            // reducer returns their initial state. This effectively populates
            // the initial state tree.
            dispatch({type: 'flux/INIT'});

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
        this.compose = (...funcs) => {
            if (funcs.length === 0) {
                return arg => arg
            }
            if (funcs.length === 1) {
                return funcs[0]
            }
            return funcs.reduce((a, b) => (...args) => a(b(...args)))
        }

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
        this.combineReducers = (reducers) => {
            const reducerKeys = Object.keys(reducers)
            const finalReducers = {}
            for (let i = 0; i < reducerKeys.length; i++) {
                const key = reducerKeys[i]
                if (typeof reducers[key] === 'function') {
                    finalReducers[key] = reducers[key]
                }
            }
            const finalReducerKeys = Object.keys(finalReducers)

            return function combination (state = {}, action) {
                let hasChanged = false
                const nextState = {}
                for (let i = 0; i < finalReducerKeys.length; i++) {
                    const key = finalReducerKeys[i]
                    const reducer = finalReducers[key]
                    const previousStateForKey = state[key]
                    const nextStateForKey = reducer(previousStateForKey, action)
                    nextState[key] = nextStateForKey
                    hasChanged = hasChanged || nextStateForKey !== previousStateForKey
                }
                return hasChanged ? nextState : state
            }
        }

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
        this.applyMiddleware = (...middlewares) => {
            return (createStore, $injector) => (reducer, preloadedState) => {
                const store = createStore(reducer, preloadedState)
                let dispatch = store.dispatch
                const middlewareAPI = {
                    getState: store.getState,
                    dispatch: (action) => dispatch(action),
                    $injector: $injector
                }
                let chain = middlewares.map(middleware => middleware(middlewareAPI))
                dispatch = this.compose(...chain)(store.dispatch)

                return Object.assign({}, store, {
                    dispatch
                })
            }
        }

        this.$get = ($log, $injector) => storeFactory($log, $injector)(options.reducer, options.preloadedState, options.enhancer);
    }

    angular
        .module('app.shared.flux')
        .provider('fluxStoreService', provider)
})()