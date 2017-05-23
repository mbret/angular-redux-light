(function () {

  /**
   * Simple action creators that handle restore/persist of the store
   */
  const factory = (fluxStoreService) => {
    const restore = () => {
      let state = window.localStorage.getItem('store.persist')
      if (state) {
        state = JSON.parse(state)
      }
      return {
        type: '@flux/restore',
        state,
      }
    }

    const persist = () => {
      window.localStorage.setItem('store.persist', JSON.stringify(fluxStoreService.getState()))
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