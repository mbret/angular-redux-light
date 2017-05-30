(function () {

  class fluxDebugLoggerService {
    info () {
      console.info('%c flux-debug ', 'background: #e6e6e6; color: #fffff', ...arguments);
    }
  }

  angular
    .module('app.shared.fluxDebug')
    .service('fluxDebugLoggerService', fluxDebugLoggerService)
})()