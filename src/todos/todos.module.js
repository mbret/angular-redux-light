const config = ($stateProvider) => {
    $stateProvider.state("app.todos", {
        url: "/todos",
        template: `
            <todos></todos>
            <todos-less-boilerplate></todos-less-boilerplate>
        `,
    });
};

angular
    .module("app.todos", [])
    .config(config);