(function() {
    class AppLessBoilerplate {

        constructor() {
            this.data = {
                todo: "test"
            };
        }

        onNewTodo() {
            this.addTodo(this.data.todo);
        }
    }

    const container = (store, appActionsCreator) => {
        return store.connect(
            (state) => {
                return {
                    todos: state.todos
                }
            },
            (dispatch) => store.bindActionCreator(appActionsCreator, dispatch)
        )(AppLessBoilerplate);
    };

    const component = {
        templateUrl: "app.component.html",
        controller: container
    };

    angular
        .module("app")
        .component("appLessBoilerplate", component)
})();