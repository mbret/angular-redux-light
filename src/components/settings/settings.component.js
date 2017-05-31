(function () {
  class Settings {
    constructor ($log, $timeout) {
      $log.log(this)
    }

    onSubmitFormA (form) {
      this.onSubmitForm({
        name: this.name
      })
    }

    test () {

    }
  }

  const component = {
    templateUrl: 'components/settings/settings.component.html',
    controller: (fluxHelperConnectService, settingsActionCreators) => {
      return fluxHelperConnectService.connect(
        (state) => {
          return {
            // we need to shallow copy settings data because angular two way binding will update the scope.
            name: state.settings.name
          }
        },
        (dispatch) => fluxHelperConnectService.bindActionCreators(settingsActionCreators, dispatch)
      )(Settings)
    }
  }

  angular
    .module('app')
    .component('settings', component)
})()