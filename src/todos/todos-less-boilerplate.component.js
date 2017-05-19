(function() {
    class TodosLessBoilerplate {

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
        templateUrl: "todos/todos-less-boilerplate.component.html",
        controller: (store, todosActionsCreator) => {
            return store.connect(
                (state) => {
                    return {
                        todos: state.todos
                    }
                },
                (dispatch) => store.bindActionCreator(todosActionsCreator, dispatch)
            )(TodosLessBoilerplate);
        }
    };

    angular
        .module("app")
        .component("todosLessBoilerplate", component)
})();