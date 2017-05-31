(function () {

  class coreLoggerService {
    info () {
      console.info('%c app ', 'background: #e6e6e6; color: #fffff', ...arguments);
    }
  }

  angular
    .module('app.core')
    .service('coreLoggerService', coreLoggerService)
})()