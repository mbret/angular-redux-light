(function () {

  const middleware = (fluxDebugService) => {
    'ngInject'
    return (store) => {
      return (next) => {
        return action => {
          if (typeof action === 'object') {
            fluxDebugService.logger.info(`[flux-debug] Action ${action.type} dispatch`, action, `state`, Object.assign({}, store.getState()))
          }
          let result = next(action)
          if (typeof action === 'object') {
            fluxDebugService.logger.info(`[flux-debug] Action ${action.type} done`, action, `state`, Object.assign({}, store.getState()))
          }
          return result
        }
      }
    }
  }

  angular
    .module('app.shared.fluxDebug')
    .factory('fluxDebugMiddleware', middleware)
})()