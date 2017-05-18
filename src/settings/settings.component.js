(function() {
    class Settings {

        constructor() {
            this.data = {
                todo: "test"
            };
        }

        onNewTodo() {
            this.addTodo(this.data.todo);
        }
    }

    const component = {
        templateUrl: "settings/settings.component.html",
        controller: (store) => {
            return store.connect()(Settings);
        }
    };

    angular
        .module("app")
        .component("settings", component)
})();