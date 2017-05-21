(function() {

    const config = ($stateProvider, fluxHelpersConnectServiceProvider) => {
        $stateProvider.state("app.tweets", {
            url: "/tweets",
            template: `<tweets></tweets>`,
        });
    };

    angular
        .module("app.tweets", [
            "app.shared.fluxHelpers"
        ])
        .config(config)
})();