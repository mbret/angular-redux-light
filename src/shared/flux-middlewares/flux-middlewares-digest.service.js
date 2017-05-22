(function() {

    const logger = ($rootScope) => {
        "ngInject";
        return (store) => (next) => action => {
            // it ensure that any code is performed to a digest cycle.
            // Be careful as it will mostly run twice all digest cycle.
            $rootScope.$evalAsync(next(action));
        }
    }

    angular
        .module("app.shared.fluxMiddlewares")
        .factory("fluxMiddlewaresDigest", logger)
})();