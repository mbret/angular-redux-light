(function () {

  /**
   * In order to make flux works, we have to configure several things.
   * First we configure the store with fluxStoreServiceProvider.setOptions. we cannot do createStore as it's an angular service. Instead
   * the service itself will do createStore with the options we passed (reducer, preloadedState, enhancer)
   *
   * We need to configure fluxHelperConnectServiceProvider as well in order to make it works with the current store.
   */
  const config = ($stateProvider, $urlServiceProvider, $injector, fluxStoreServiceProvider, todosReducers, tweetsReducers,
                  settingsReducer, fluxHelperConnectServiceProvider, fluxHelperServiceProvider, $logProvider) => {
    // Basic configuration for root route.
    $stateProvider.state('app', {
      abstract: true,
      component: 'app',
    })
    $urlServiceProvider.rules.otherwise({state: 'app.todos'})
    $logProvider.debugEnabled(true)

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
      enhancer: (fluxHelperService, fluxMiddlewaresLogger, fluxMiddlewaresThunk, fluxMiddlewaresDigest, fluxMiddlewaresDebug, fluxDebugService) => {
        'ngInject'
        return fluxHelperService.compose(
          fluxHelperService.applyMiddleware(
            fluxMiddlewaresLogger,
            fluxMiddlewaresThunk,
            fluxMiddlewaresDigest,
          ),
          fluxDebugService.enhance()
        )
      },
    })

    // Configure flux helpers to deal with correct store.
    fluxHelperConnectServiceProvider.setOptions({
      getStore: (fluxStoreService) => fluxStoreService,
    })
  }

  /**
   * Main module run.
   */
  const run = ($log) => {
    $log.log('App is running!', 'sdf')
  }

  angular
    .module('app', [
      'ui.router',
      'app.core',
      'app.settings',
      'app.todos',
      'app.tweets',
      'app.shared.flux',
      'app.shared.fluxMiddlewares',
      'app.shared.fluxDebug',
      'app.shared.log',
    ])
    .config(config)
    .run(run)
})()