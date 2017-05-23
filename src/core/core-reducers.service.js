(function () {

  angular
    .module('app.core')
    .factory('appCoreReducers', (fluxHelperService, coreRestoreReducer, appCoreRouterReducer) => {
      return fluxHelperService.reduceReducers(
        coreRestoreReducer,
        appCoreRouterReducer,
      )
    })
})()