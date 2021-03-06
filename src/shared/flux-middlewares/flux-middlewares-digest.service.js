(function () {

  const logger = ($rootScope) => {
    'ngInject'
    return (store) => {
      return (next) => {
        return action => {
          // it ensure that any code will be handled by a digest cycle.
          // the digest cycle is queue
          $rootScope.$evalAsync(next(action))
        }
      }
    }
  }

  angular
    .module('app.shared.fluxMiddlewares')
    .factory('fluxMiddlewaresDigestMiddleware', logger)
})()