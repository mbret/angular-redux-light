(function() {

    const addTodo = (text) => {
        console.log("addTodo");
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
        .module("app")
        .constant("todosActionsCreator", {
            addTodo,
            addAsyncTodo,
            removeTodos
        });
})();