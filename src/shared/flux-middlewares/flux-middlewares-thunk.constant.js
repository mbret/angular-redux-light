(function() {

    const thunk = (store) => {
        return (next) => {
            return (action) => {
                return typeof action === 'function' ?
                    action(store.dispatch, store.getState) :
                    next(action)
            }
        }
    }

    angular
        .module("app.shared.fluxMiddlewares")
        .constant("fluxMiddlewaresThunk", thunk)
})();