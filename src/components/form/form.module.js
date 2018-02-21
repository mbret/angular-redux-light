(function () {
  const config = ($stateProvider) => {
    $stateProvider.state('app.form', {
      url: '/form',
      template: `<form-view></form-view>`,
    })
  }

  angular
    .module('app.form', [])
    .config(config)
})()