(function() {
    class TodoStateLess {
        constructor() {
            console.log(this);
        }
    }

    const component = {
        bindings: {
            todos: "="
        },
        template: `
            <div class="card">
            <div class="card-header">
                I'm a stateless component inside a container
            </div>
            <div class="card-block">
                <p class="card-text">I can display todos as well but I got props from the parent component</p>
                <div class="card" ng-repeat="todo in $ctrl.todos">
                    <div class="card-block">
                        This is some text within a card block.
                    </div>
                </div>
            </div>
        </div>
        `,
        controller: TodoStateLess
    };

    angular
        .module("app")
        .component("todosStateLess", component)
})();