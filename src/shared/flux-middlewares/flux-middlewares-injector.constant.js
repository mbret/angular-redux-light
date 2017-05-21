(function() {

    const logger = (store) => {
        return (next) => {
            return action => {
                // we got fn or array to be injected
                // (myAngularService) => {}, ["myAngularService", (myAngularService) => {}]
                if (typeof action === "function" || Array.isArray(action)) {
                    return next(store.$injector.invoke(action));
                }
                return next(action);
            };
        };
    };

    angular
        .module("app.shared.fluxMiddlewares")
        .constant("fluxMiddlewaresInjector", logger)
})();