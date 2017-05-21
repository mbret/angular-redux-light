const addTodo = (text) => {
    console.log("addTodo");
    return {
        type: "ADD_TODO",
        text
    }
};

const removeTodos = () => {
    return {
        type: "REMOVE_TODOS",
    }
};

angular
    .module("app")
    .service("todosActionsCreator", function() {
        return {
            addTodo,
            removeTodos
        }
    });