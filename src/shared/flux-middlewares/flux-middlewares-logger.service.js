(function () {

  const logger = ($log) => {
    'ngInject'
    return (store) => {
      return (next) => {
        return action => {
          if (typeof action === 'object') {
            $log.info(`Action dispatch`, action, `state`, store.getState())
          }
          let result = next(action)
          if (typeof action === 'object') {
            $log.info(`Action done`, action, `state`, store.getState())
          }
          return result
        }
      }
    }
  }

  angular.module('app.shared.fluxMiddlewares')
    .factory('fluxMiddlewaresLogger', logger)
})()