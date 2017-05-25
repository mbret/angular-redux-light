(function () {

  const factory = () => {
    'ngInject'

    const saveForm = (data) => {
      return {
        type: '@app/SETTINGS_SAVE_FORM',
        data: data
      }
    }

    const onSubmitForm = (data) => {
      return (dispatch) => {
        setTimeout(() => {
          dispatch(saveForm(data))
        }, 1000)
      }
    }

    return {
      onSubmitForm,
    }
  }

  angular
    .module('app.settings')
    .factory('settingsActionCreators', factory)
})()