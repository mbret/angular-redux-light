(function() {
    class Todos {

        constructor() {
            this.alerts = [];
            this.data = {
                todo: "test"
            };
        }

        $onStateChanges(state) {
            console.log("Todos: $onStateChanges", state);
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

    const container = (fluxHelpersConnectService, todosActionsCreator) => {
        return fluxHelpersConnectService.connect(
            (state) => {
                return {
                    todos: state.todos
                }
            },
            (dispatch) => {
                return {
                    addTodo: (text) => dispatch(todosActionsCreator.addTodo(text)),
                    removeTodos: () => dispatch(todosActionsCreator.removeTodos())
                }
            }
        )(Todos);
    };

    const component = {
        templateUrl: "components/todos/todos.component.html",
        controller: container
    };

    angular
        .module("app")
        .component("todos", component)
})();