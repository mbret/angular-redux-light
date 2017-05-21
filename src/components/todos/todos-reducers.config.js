(function() {
    const defaultState = [];

    const todos = (state = defaultState, action) => {
        switch (action.type) {
            case "ADD_TODO":
                return state.concat([
                    {
                        text: action.text,
                    }
                ]);
            case "REMOVE_TODOS":
                return Object.assign({}, {
                    todos: []
                });
            default:
                return state
        }
    };

    angular
        .module("app")
        .constant("todosReducers", todos);
})();