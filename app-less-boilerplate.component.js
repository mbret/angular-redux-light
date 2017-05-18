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
            (dispatch) => {
                return {
                    addTodo: (text) => dispatch(appActionsCreator.addTodo(text)),
                    removeTodos: () => dispatch(appActionsCreator.removeTodos())
                }
            }
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