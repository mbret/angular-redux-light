(function () {

  const defaultState = undefined;

  /**
   * This reducer restore the state. It should be the first reducer in
   * the chain. Depending of the
   */
  const coreRestoreReducer = (state = defaultState, action) => {
    switch (action.type) {
      case "@flux/restore":
        return action.state
      default:
        return state
    }
  };

  angular
    .module('app.core')
    .constant('coreRestoreReducer', coreRestoreReducer)
})()