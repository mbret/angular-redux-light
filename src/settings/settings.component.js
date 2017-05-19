(function() {
    class Settings {
        constructor() {
            console.log(this);
        }
    }

    const component = {
        templateUrl: "settings/settings.component.html",
        controller: (store, todosActionsCreator) => {
            return store.connect(
                (state) => {
                    return {}
                },
                (dispatch) => store.bindActionCreator(todosActionsCreator, dispatch)
            )(Settings);
        }
    };

    angular
        .module("app")
        .component("settings", component)
})();