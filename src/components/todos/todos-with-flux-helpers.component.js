(function() {
    class TodosLessBoilerplate {

        constructor() {
            console.log("AppLessBoilerplate", this);
            this.data = {
                todo: "test"
            };
        }

        onNewTodo() {
            this.addTodo(this.data.todo);
        }
    }

    const component = {
        templateUrl: "components/todos/todos-with-flux-helpers.component.html",
        controller: (fluxHelpersConnectService, todosActionsCreator) => {
            return fluxHelpersConnectService.connect(
                (state) => {
                    return {
                        todos: state.todos
                    }
                },
                (dispatch) => fluxHelpersConnectService.bindActionCreators(todosActionsCreator, dispatch)
            )(TodosLessBoilerplate);
        }
    };

    angular
        .module("app")
        .component("todosLessBoilerplate", component)
})();