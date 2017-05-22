(function () {

  const config = ($stateProvider, fluxHelperConnectServiceProvider) => {
    $stateProvider.state('app.tweets', {
      url: '/tweets',
      template: `<tweets></tweets>`,
    })

    fluxHelperConnectServiceProvider.setOptions({})
  }

  angular.module('app.tweets', [
    'app.shared.flux',
  ]).config(config)
})()