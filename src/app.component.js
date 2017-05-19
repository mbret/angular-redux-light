(function() {
    class App {
        constructor() {

        }
    }

    const component = {
        templateUrl: "app.component.html",
        controller: App
    };

    angular
        .module("app")
        .component("app", component)
})();