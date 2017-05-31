(function () {

  /**
   * In order to make flux works, we have to configure several things.
   * First we configure the store with fluxStoreServiceProvider.setOptions. we cannot do createStore as it's an angular service. Instead
   * the service itself will do createStore with the options we passed (reducer, preloadedState, enhancer)
   *
   * We need to configure fluxHelperConnectServiceProvider as well in order to make it works with the current store.
   */
  const config = ($urlServiceProvider, $injector, fluxStoreServiceProvider, fluxDebugServiceProvider) => {
    // Configure router
    $urlServiceProvider.rules.otherwise({state: 'app.todos'})

    fluxDebugServiceProvider.setOptions({
      watchReducers: true,
      // @ngInject
      getLogger: (coreLoggerService) => coreLoggerService
    })

    // Configure store creation
    fluxStoreServiceProvider.setOptions({
      // @ngInject
      reducer: (appCoreReducer) => appCoreReducer,
      // @ngInject
      enhancer: (appCoreEnhancer) => appCoreEnhancer,
    })
  }

  angular
    .module('app.core')
    .config(config)
})()