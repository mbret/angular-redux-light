(function () {

  const run = ($transitions, appCoreRouterActionCreators) => {
    $transitions.onFinish({}, (trans) => {
      appCoreRouterActionCreators.saveTransition(trans)
    })
  }

  angular
    .module('app.core', [
      'app.shared.flux',
    ])
    .run(run)
})()