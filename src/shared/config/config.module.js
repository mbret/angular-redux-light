(function() {

  const APP_CONFIG = Object.assign({}, {
    logLvl: 'log',
  })

  angular
    .module('app.shared.config', [])
    .constant('APP_CONFIG', APP_CONFIG)
})()