(function () {

  const run = ($transitions, appCoreRouterActionCreators, $trace) => {
    // We enable routing debug
    $trace.enable('TRANSITION');

    $transitions.onFinish({}, (trans) => {
      appCoreRouterActionCreators.saveTransition(trans)
    })
  }

  angular
    .module('app.core', [
      'ui.router',
      'app.config',
      'app.shared.flux',
      'app.settings',
      'app.todos',
      'app.tweets',
      'app.shared.flux',
      'app.shared.fluxMiddlewares',
      'app.shared.fluxDebug',
      'app.shared.log',
    ])
    .run(run)
})()