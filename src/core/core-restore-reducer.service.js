(function () {

  const defaultState = {
    restoring: false
  };

  /**
   * This reducer restore the state. It should be the first reducer in
   * the chain.
   * This reducer should not alter the given state as it only pass the restored store.
   * However a specific store key is available 'restoring' when you need to apply some conditions
   * inside your reducers.
   */
  const coreRestoreReducer = (state = defaultState, action) => {
    switch (action.type) {
      case "@flux/RESTORE_START":
        return Object.assign({
          restoring: true
        }, action.state)
      case "@flux/RESTORE_END":
        return Object.assign({
          restoring: false
        }, action.state)
      default:
        return state
    }
  };

  angular
    .module('app.core')
    .factory('coreRestoreReducer', function () {
      return coreRestoreReducer
    })
})()