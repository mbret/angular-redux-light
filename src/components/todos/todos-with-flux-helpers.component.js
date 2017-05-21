(function() {

    /**
     * This component is identical to todos.component except that it use connect as helper
     * to avoid a lot of boilerplate. Both component use the same template.
     */
    class TodosLessBoilerplate {

        constructor() {
            console.log("AppLessBoilerplate", this);
            this.data = {
                todo: "Something else to do!"
            };
        }

        onNewTodo() {
            this.addTodo(this.data.todo);
        }
    }

    const component = {
        templateUrl: "components/todos/todos.component.html",
        // Instead of passing our controller directly we wrap inside of connect service.
        // It will handle some task like (refreshing props, mapping action creators to the component, etc)
        controller: (fluxHelperConnectService, todosActionsCreator) => {
            return fluxHelperConnectService.connect(
                // Here we declare the mapStateToProps function. Each time the store update, the function will
                // update the component props.
                (state) => {
                    return {
                        todos: state.todos
                    }
                },
                // The function dispatchActionToProps will automatically bind all actions to the component and wrap it
                // so you don't need to do dispatch() manually.
                (dispatch) => fluxHelperConnectService.bindActionCreators(todosActionsCreator, dispatch)
            )(TodosLessBoilerplate);
        }
    };

    angular
        .module("app")
        .component("todosLessBoilerplate", component)
})();