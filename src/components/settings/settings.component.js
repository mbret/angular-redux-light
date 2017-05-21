(function() {
    class Settings {
        constructor() {
            console.log(this);
        }
    }

    const component = {
        templateUrl: "components/settings/settings.component.html",
        controller: (fluxHelpersConnectService, todosActionsCreator) => {
            return fluxHelpersConnectService.connect(
                (state) => {
                    return {}
                },
                (dispatch) => fluxHelpersConnectService.bindActionCreators(todosActionsCreator, dispatch)
            )(Settings);
        }
    };

    angular
        .module("app")
        .component("settings", component)
})();