(function() {
    const config = ($stateProvider, $urlServiceProvider, storeProvider, todosReducers, tweetsReducers) => {
        $stateProvider.state("app", {
            abstract: true,
            component: "app"
        });
        // when there is an empty route, redirect to /index
        $urlServiceProvider.rules.otherwise({ state: 'app.todos' });

        console.log(tweetsReducers);

        // create store
        storeProvider.setOptions({
            reducers: todosReducers.concat(tweetsReducers)
        });
    };

    angular
        .module("app", ["ui.router", "app.settings", "app.todos", "app.tweets"])
        .config(config)
        .run(() => {
            console.log("run");
        });
})();