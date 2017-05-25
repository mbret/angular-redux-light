(function() {

    const middleware = () => {
        "ngInject"
        return (store) => (next) => action => {
            console.log(store)
            next(action);
        }
    }

    angular
        .module("app.shared.fluxMiddlewares")
        .factory("fluxMiddlewaresDebug", middleware)
})();