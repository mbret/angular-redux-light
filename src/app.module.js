(function() {

    /**
     * In order to make flux works, we have to configure several things.
     * First we configure the store with fluxStoreServiceProvider.setOptions. we cannot do createStore as it's an angular service. Instead
     * the service itself will do createStore with the options we passed (reducer, preloadedState, enhancer)
     *
     * We need to configure fluxHelperConnectServiceProvider as well in order to make it works with the current store.
     */
    const config = ($stateProvider, $urlServiceProvider, $injector, fluxStoreServiceProvider, todosReducers, tweetsReducers,
                    fluxHelperConnectServiceProvider, fluxMiddlewaresLogger, fluxMiddlewaresInjector, fluxMiddlewaresThunk, fluxHelperServiceProvider) => {
        // Basic configuration for root route.
        $stateProvider.state("app", {
            abstract: true,
            component: "app"
        });
        $urlServiceProvider.rules.otherwise({ state: 'app.todos' });

        // Configure store creation
        fluxStoreServiceProvider.setOptions({
            reducer: fluxHelperServiceProvider.combineReducers({
                todos: todosReducers,
                tweets: tweetsReducers
            }),
            enhancer: fluxHelperServiceProvider.applyMiddleware(
                fluxMiddlewaresLogger,
                fluxMiddlewaresInjector,
                fluxMiddlewaresThunk,
            )
        });

        // Configure flux helpers to deal with correct store.
        fluxHelperConnectServiceProvider.setOptions({
            getStore: (fluxStoreService) => fluxStoreService
        });
    };

    /**
     * Main module run.
     */
    const run = ($log, fluxStoreService) => {
        $log.info("App is running!");

        fluxStoreService.subscribe(() => {
            $log.info("State has been updated!", fluxStoreService.getState());
        });
    };

    angular
        .module("app", [
            "ui.router",
            "app.settings",
            "app.todos",
            "app.tweets",
            "app.shared.flux",
            "app.shared.fluxHelper",
            "app.shared.fluxMiddlewares"
        ])
        .config(config)
        .run(run);
})();