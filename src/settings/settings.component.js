(function() {
    class Settings {
        constructor() {
            console.log(this);
        }
    }

    const component = {
        templateUrl: "settings/settings.component.html",
        controller: (store, appActionsCreator) => {
            return store.connect(
                (state) => {
                    return {}
                },
                (dispatch) => store.bindActionCreator(appActionsCreator, dispatch)
            )(Settings);
        }
    };

    angular
        .module("app")
        .component("settings", component)
})();