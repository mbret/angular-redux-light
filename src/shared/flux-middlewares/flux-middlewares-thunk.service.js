(function() {

    const thunk = () => {
        "ngInject";
        return (store) => {
            return (next) => {
                return (action) => {
                    return typeof action === 'function' ?
                        action(store.dispatch, store.getState) :
                        next(action)
                }
            }
        }
    }

    angular
        .module("app.shared.fluxMiddlewares")
        .factory("fluxMiddlewaresThunk", thunk)
})();