(function() {

    /**
     * This component let you handle todo list.
     * It does not use helpers and show you how to use store, action creators directly.
     */
    class Todos {

        constructor(fluxStoreService, todosActionsCreator, $log) {
            this.todosActionsCreator = todosActionsCreator;
            this.fluxStoreService = fluxStoreService;
            this.unsubcribeStore = null;
            this.$log = $log
        }

        /**
         * We just use our component in the classic way and use the store to initialize
         * the component props.
         * To keep our scope synchronized we have to subscribe to the store.
         */
        $onInit() {
            this.alerts = [];
            this.data = {
                todo: "Something to do!"
            };
            this.todos = Object.assign({}, this.fluxStoreService.getState().todos);

            // we synchronize scope with store
            this.unsubcribeStore = this.fluxStoreService.subscribe(() => {
                this.todos = Object.assign({}, this.fluxStoreService.getState().todos)

                this.alerts.push({
                    date: new Date(),
                    text: "The store has been updated"
                });
            });
        }

        /**
         * We need to explicitly remove store subscription.
         */
        $onDestroy() {
            if (this.unsubcribeStore) {
                this.unsubcribeStore();
            }
        }

        $doCheck(changesObj) {

        }

        onNewTodo() {
            this.fluxStoreService.dispatch(this.todosActionsCreator.addTodo(this.data.todo));
        }

        onNewAsyncTodo() {
            this.fluxStoreService.dispatch(this.todosActionsCreator.addAsyncTodo(this.data.todo));
        }

        removeTodos() {
            this.fluxStoreService.dispatch(this.todosActionsCreator.removeTodos(this.data.todo));
        }

        removeAlerts() {
            this.alerts = [];
        }
    }

    const component = {
        templateUrl: "components/todos/todos.component.html",
        controller: Todos
    };

    angular
        .module("app.todos")
        .component("todos", component)
})();