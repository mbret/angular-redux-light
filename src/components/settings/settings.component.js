(function() {
    class Settings {
        constructor($log) {
          $log.log(this);
        }
    }

    const component = {
        templateUrl: "components/settings/settings.component.html",
        controller: (fluxHelperConnectService, todosActionsCreator) => {
            return fluxHelperConnectService.connect(
                (state) => {
                    return {}
                },
                (dispatch) => fluxHelperConnectService.bindActionCreators(todosActionsCreator, dispatch)
            )(Settings);
        }
    };

    angular
        .module("app")
        .component("settings", component)
})();