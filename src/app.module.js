const config = ($stateProvider, $urlServiceProvider, storeProvider, appReducers) => {
    $stateProvider.state("app", {
        abstract: true,
        // url: ""
    });
    $stateProvider.state("app.home", {
        url: "/home",
        template: `
            <app></app>
            <app-less-boilerplate></app-less-boilerplate>
        `,
    });
    // when there is an empty route, redirect to /index
    $urlServiceProvider.rules.otherwise({ state: 'app.home' });

    // create store
    storeProvider.setOptions({
        reducers: appReducers
    });
};

angular
    .module("app", ["ui.router", "app.settings"])
    .config(config)
    .run(() => {
        console.log("run");
    });