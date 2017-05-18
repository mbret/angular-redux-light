(function() {
    class AppLessBoilerplate {

        constructor() {
            console.log("AppLessBoilerplate", this)
            this.data = {
                todo: "test"
            };
        }

        onNewTodo() {
            this.addTodo(this.data.todo);
        }
    }

    const component = {
        templateUrl: "app-less-boilerplate.component.html",
        controller: (store, appActionsCreator) => {
            return store.connect(
                (state) => {
                    return {
                        todos: state.todos
                    }
                },
                (dispatch) => store.bindActionCreator(appActionsCreator, dispatch)
            )(AppLessBoilerplate);
        }
    };

    angular
        .module("app")
        .component("appLessBoilerplate", component)
})();