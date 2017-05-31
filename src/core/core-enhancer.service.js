(function () {

  angular
    .module('app.core')
    .factory('appCoreEnhancer', (fluxHelperService, fluxDebugService) => {
      return fluxHelperService.compose(
        // classic middlewares
        fluxHelperService.applyMiddleware(
          'fluxDebugMiddleware',
          'fluxMiddlewaresThunkMiddleware',
          'fluxMiddlewaresDigestMiddleware',
        ),
        // debug enhancer
        // It's important to call debug at the end
        fluxDebugService.enhance(),
      )
    })
})()