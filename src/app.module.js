(function() {
    const config = ($stateProvider, $urlServiceProvider, storeProvider, todosReducers) => {
        $stateProvider.state("app", {
            abstract: true,
            component: "app"
        });
        // when there is an empty route, redirect to /index
        $urlServiceProvider.rules.otherwise({ state: 'app.todos' });

        // create store
        storeProvider.setOptions({
            reducers: todosReducers
        });
    };

    angular
        .module("app", ["ui.router", "app.settings", "app.todos"])
        .config(config)
        .run(() => {
            console.log("run");
        });
})();