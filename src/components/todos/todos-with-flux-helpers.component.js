(function() {

    /**
     * This component is identical to todos.component except that it use connect as helper
     * to avoid a lot of boilerplate. Both component use the same template.
     */
    class TodosLessBoilerplate {

        constructor() {

        }

        $onInit() {
            this.alerts = [];
            this.data = {
                todo: "Something else to do!"
            };
        }

        $onStateChanges() {
            this.alerts.push({
                date: new Date(),
                text: "The store has been updated"
            });
        }

        onNewTodo() {
            // We can then use action creators this way.
            // We could have even use action creators function directly inside ng-click and handle logic
            // on action creator side.
            this.addTodo(this.data.todo);
        }

        onNewAsyncTodo() {
            this.addAsyncTodo(this.data.todo);
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
                        // Be careful when using object for ng-repeat as Angular will add $$hashKey to the object (and mutate it)
                        // To avoid this, use immutable or track by option.
                        todos: Object.assign({}, state.todos)
                    }
                },
                // The function dispatchActionToProps will automatically bind all actions to the component and wrap it
                // so you don't need to do dispatch() manually.
                (dispatch) => fluxHelperConnectService.bindActionCreators(todosActionsCreator, dispatch)
            )(TodosLessBoilerplate);
        }
    };

    angular
        .module("app.todos")
        .component("todosLessBoilerplate", component)
})();