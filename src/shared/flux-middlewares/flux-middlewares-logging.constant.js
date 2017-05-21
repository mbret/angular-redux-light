(function() {

    const logger = (store) => {
        return (next) => {
            return action => {
                if (typeof action === "object") {
                    console.log(`Action dispatch`, action, `state`, store.getState());
                }
                let result = next(action);
                if (typeof action === "object") {
                    console.log(`Action done`, action, `state`, store.getState());
                }
                return result;
            };
        };
    };

    angular
        .module("app.shared.fluxMiddlewares")
        .constant("fluxMiddlewaresLogger", logger)
})();