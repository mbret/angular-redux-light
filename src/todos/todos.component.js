(function() {
    class Todos {

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

    const container = (store, todosActionsCreator) => {
        return store.connect(
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
        templateUrl: "todos/todos.component.html",
        controller: container
    };

    angular
        .module("app")
        .component("todos", component)
})();