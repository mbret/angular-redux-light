(function () {
  angular
    .module('app.core')
    .factory('appCoreReducer', (fluxHelperService, coreRestoreReducer, appCoreRouterReducer, todosReducers, tweetsReducer, settingsReducer) => {
      return fluxHelperService.reduceReducers(
        coreRestoreReducer,
        appCoreRouterReducer,
        fluxHelperService.combineReducers({
          todos: todosReducers,
          tweets: tweetsReducer,
          settings: settingsReducer
        })
      )
    })
})()