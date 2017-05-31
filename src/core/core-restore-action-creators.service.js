(function () {

  /**
   * Simple action creators that handle restore/persist of the store
   * @todo add provider to configure get/set storage.
   * @todo add custom function with callback support to implement specific logic
   * @todo during restoring dispatch.
   */
  const factory = (fluxStoreService) => {
    const restore = () => {
      return (dispatch) => {
        let state = window.localStorage.getItem('store.persist')
        if (state) {
          state = JSON.parse(state)
        }
        dispatch({
          type: '@flux/RESTORE_START',
          state,
        })
        dispatch({
          type: '@flux/RESTORE_END',
          state,
        })
      }
    }

    const persist = () => {
      window.localStorage.setItem('store.persist', JSON.stringify(fluxStoreService.getState()))
      // @todo not used yet
      return {
        type: '@flux/persist'
      }
    }

    return {
      restore,
      persist
    }
  }

  angular
    .module('app.core')
    .factory('appCoreRestoreActionCreators', factory)
})()