(function () {

  const logLvls = ['trace', 'debug', 'log', 'info', 'warn', 'error']

  const config = ($provide, APP_CONFIG) => {

    let logLvl = APP_CONFIG.logLvl || 'info'

    const decorator = ($delegate) => {

      $delegate.trace = (logLvls.indexOf(logLvl) <= 0) ? console.trace.bind(console) : () => {}
      $delegate.debug = (logLvls.indexOf(logLvl) <= 1) ? console.debug.bind(console) : () => {}
      $delegate.log = (logLvls.indexOf(logLvl) <= 2) ? console.log.bind(console) : () => {}
      $delegate.info = (logLvls.indexOf(logLvl) <= 3) ? console.info.bind(console) : () => {}
      $delegate.warn = (logLvls.indexOf(logLvl) <= 4) ? console.warn.bind(console) : () => {}
      $delegate.error = (logLvls.indexOf(logLvl) <= 5) ? console.error.bind(console) : () => {}

      return $delegate
    }

    $provide.decorator('$log', decorator)
  }

  angular.module('app')
    .config(config)
})()