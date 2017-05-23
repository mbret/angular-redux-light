(function () {

  /**
   * Simple action creators that handle restore/persist of the store
   */
  const factory = () => {
    const saveTransition = (trans) => {
      return {
        type: 'ROUTER_TRANSITION_FINISH',
        trans,
      }
    }

    return {
      saveTransition,
    }
  }

  angular
    .module('app.core')
    .factory('appCoreRouterActionCreators', factory)
})()