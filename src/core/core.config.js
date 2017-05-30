(function() {

  /**
   * In order to make flux works, we have to configure several things.
   * First we configure the store with fluxStoreServiceProvider.setOptions. we cannot do createStore as it's an angular service. Instead
   * the service itself will do createStore with the options we passed (reducer, preloadedState, enhancer)
   *
   * We need to configure fluxHelperConnectServiceProvider as well in order to make it works with the current store.
   */
  const config = ($urlServiceProvider, $injector, fluxStoreServiceProvider, todosReducers, tweetsReducers,
                  settingsReducer, fluxHelperConnectServiceProvider, fluxHelperServiceProvider) => {

    // Configure router
    $urlServiceProvider.rules.otherwise({state: 'app.todos'})

    // Logs are configured inside /config/config.module.js

    // Configure store creation
    fluxStoreServiceProvider.setOptions({
      reducer: (appCoreReducers) => {
        'ngInject'
        return fluxHelperServiceProvider.reduceReducers(
          appCoreReducers,
          fluxHelperServiceProvider.combineReducers({
            todos: todosReducers,
            tweets: tweetsReducers,
            settings: settingsReducer
          })
        )
      },
      enhancer: (fluxHelperService, fluxDebugService) => {
        'ngInject'
        return fluxHelperService.compose(
          fluxHelperService.applyMiddleware(
            'fluxDebugMiddleware',
            'fluxMiddlewaresThunkMiddleware',
            'fluxMiddlewaresDigestMiddleware',
          ),
          // It's important to call debug at the end
          fluxDebugService.enhance(),
        )
      },
    })
  }

  angular
    .module('app.core')
    .config(config)
})()