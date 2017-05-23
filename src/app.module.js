(function () {

  /**
   * In order to make flux works, we have to configure several things.
   * First we configure the store with fluxStoreServiceProvider.setOptions. we cannot do createStore as it's an angular service. Instead
   * the service itself will do createStore with the options we passed (reducer, preloadedState, enhancer)
   *
   * We need to configure fluxHelperConnectServiceProvider as well in order to make it works with the current store.
   */
  const config = ($stateProvider, $urlServiceProvider, $injector, fluxStoreServiceProvider, todosReducers, tweetsReducers,
                  fluxHelperConnectServiceProvider, fluxHelperServiceProvider, $logProvider, coreRestoreReducer) => {
    // Basic configuration for root route.
    $stateProvider.state('app', {
      abstract: true,
      component: 'app',
    })
    $urlServiceProvider.rules.otherwise({state: 'app.todos'})
    $logProvider.debugEnabled(true)

    // Configure store creation
    fluxStoreServiceProvider.setOptions({
      reducer: fluxHelperServiceProvider.reduceReducers(
        coreRestoreReducer,
        fluxHelperServiceProvider.combineReducers({
          todos: todosReducers,
          tweets: tweetsReducers
        })
      ),
      enhancer: (fluxHelperService, fluxMiddlewaresLogger, fluxMiddlewaresThunk, fluxMiddlewaresDigest) => {
        'ngInject'
        return fluxHelperService.applyMiddleware(
          fluxMiddlewaresLogger,
          fluxMiddlewaresThunk,
          fluxMiddlewaresDigest,
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
  const run = ($log, fluxStoreService) => {
    $log.log('App is running!', 'sdf')
    // setTimeout(() => { fluxStoreService.dispatch(appCoreRestoreActionCreators.restore({ tweets: 1, todos: 2 })) }, 5000)
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
      'app.shared.log',
    ])
    .config(config)
    .run(run)
})()