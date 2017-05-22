(function () {
  const config = ($stateProvider) => {
    $stateProvider.state('app.settings', {
      url: '/settings',
      template: `
            <settings></settings>
        `,
    })
  }

  angular
    .module('app.settings', [])
    .config(config)
    .run(($log) => {
      $log.log('run settings')
    })
})()