(function() {

    const addTodo = (text) => {
        return {
            type: "ADD_TODO",
            text
        }
    };

    const addAsyncTodo = (text) => ($timeout) => {
        return (dispatch) => {
            $timeout(() => dispatch(addTodo(text)), 2000);
        }
    };

    const removeTodos = () => {
        return {
            type: "REMOVE_TODOS",
        }
    };

    angular
        .module("app.todos")
        .constant("todosActionsCreator", {
            addTodo,
            addAsyncTodo,
            removeTodos
        });
})();