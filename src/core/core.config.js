(function() {

  const APP_CONFIG = Object.assign({}, {
    logLvl: 'log',
  })

  angular
    .module('app.core')
    .constant('APP_CONFIG', APP_CONFIG)
})()