const config = ($stateProvider, $urlServiceProvider, storeProvider, appReducers) => {
    $stateProvider.state("index", {
        url: "/",
        template: `
            <app></app>
            <app-less-boilerplate></app-less-boilerplate>
        `,
    });
    // when there is an empty route, redirect to /index
    $urlServiceProvider.rules.otherwise({ state: 'index' });

    storeProvider.setOptions({
        reducers: appReducers
    })
};

angular
    .module("app", ["ui.router"])
    .config(config)
    .run((store) => {
        console.log("run");
    });