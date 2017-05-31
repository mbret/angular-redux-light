(function () {

  const defaultState = undefined;

  /**
   * This reducer restore the state. It should be the first reducer in
   * the chain. Depending of the
   */
  const router = (state = defaultState, action) => {
    switch (action.type) {
      default:
        return state
    }
  };

  angular
    .module('app.core')
    .factory('appCoreRouterReducer', function () {
      return router
    })
})()