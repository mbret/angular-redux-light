(function() {

    class App {
        constructor() {

        }
    }

    const component = {
        template: `<ui-view></ui-view>`,
        controller: App
    };

    angular
        .module("app")
        .component("app", component)
})();