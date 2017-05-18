const addTodo = (text) => {
    console.log("addTodo");
    return {
        type: "ADD_TODO",
        text
    }
}

const removeTodos = () => {
    return {
        type: "REMOVE_TODOS",
    }
}

const appActionsCreator = function() {
    return {
        addTodo,
        removeTodos
    }
};

angular
    .module("app")
    .service("appActionsCreator", appActionsCreator);