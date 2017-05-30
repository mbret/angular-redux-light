(function() {
    const defaultState = [
        {
            text: "This is the first and automatic created todo!"
        }
    ];

    const todos = (state = defaultState, action) => {
        switch (action.type) {
            case "ADD_TODO":
                return state.concat([
                    {
                        text: action.text,
                    }
                ]);
            case "REMOVE_TODOS":
                return [];
            default:
                return state
        }
    };

    angular
        .module("app.todos")
        .constant("todosReducers", todos);
})();