(function () {

  const config = ($stateProvider) => {
    // Basic configuration for root route.
    $stateProvider.state('app', {
      abstract: true,
      component: 'app',
    })
  }

  /**
   * Main module run.
   */
  const run = ($log) => {
    $log.log('App is now running!')
  }

  angular
    .module('app', [
      'app.core',
    ])
    .config(config)
    .run(run)
})()