(function() {
    class App {

        constructor() {
            this.alerts = [];
            this.data = {
                todo: "test"
            };
        }

        $onStateChanges(state) {
            this.alerts.push({
                date: new Date(),
                text: "state has been updated"
            });
        }

        onNewTodo() {
            this.addTodo(this.data.todo);
        }

        removeAlerts() {
            this.alerts = [];
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
        )(App);
    };

    const component = {
        templateUrl: "app.component.html",
        controller: container
    };

    angular
        .module("app")
        .component("app", component)
})();