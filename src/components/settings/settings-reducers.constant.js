(function () {

  const defaultState = {
    name: undefined
  }

  const reducer = (state = defaultState, action) => {
    switch (action.type) {
      case '@app/SETTINGS_SAVE_FORM':
        return Object.assign({}, state, action.data)
      default:
        return state
    }
  }

  angular
    .module('app.settings')
    .constant('settingsReducer', reducer)
})()