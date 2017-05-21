(function() {

    const config = ($stateProvider, fluxHelperConnectServiceProvider) => {
        $stateProvider.state("app.tweets", {
            url: "/tweets",
            template: `<tweets></tweets>`,
        });
    };

    angular
        .module("app.tweets", [
            "app.shared.fluxHelper"
        ])
        .config(config)
})();