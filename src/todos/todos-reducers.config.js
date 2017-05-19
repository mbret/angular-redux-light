
const todos = (state = {}, action) => {
    console.log("reducer todos", state, action);
    switch (action.type) {
        case "ADD_TODO":
            return Object.assign({}, {
                todos: state.todos.concat([
                    {
                        text: action.text,
                    }
                ])
            });
        case "REMOVE_TODOS":
            return Object.assign({}, {
                todos: []
            });
        default:
            return state
    }
};

const todos2 = (state = {}, action) => {
    console.log("reducer todos2", state, action);
    switch (action.type) {
        default:
            return state
    }
};

angular
    .module("app")
    .constant("todosReducers", [todos, todos2]);