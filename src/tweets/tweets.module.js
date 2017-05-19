(function() {

    const config = ($stateProvider) => {
        $stateProvider.state("app.tweets", {
            url: "/tweets",
            template: `<tweets></tweets>`,
        });
    };

    angular
        .module("app.tweets", [])
        .config(config)
})();