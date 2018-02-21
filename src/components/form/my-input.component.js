(function () {

  const template = `
    <input
        ng-attr-name="{{$ctrl.fName}}" 
        ng-attr-type="{{$ctrl.type}}"
        ng-attr-value="{{$ctrl.value}}"
        ng-required="$ctrl.state.required"
        ng-model="$ctrl.state.model"
        ng-change="$ctrl.onInnerChange()"
        ng-click="$ctrl.onInnerClick()"
        ng-model-options="{allowInvalid: true}"
    />
    `

  class MyInput {
    constructor ($scope, $element, $document) {
      'ngInject'
      this.$element = $element
      this.$document = $document
      this.$scope = $scope
      this.state = {
        model: undefined,
        required: false
      }
    }

    $onInit () {}

    $onChanges (changes) {
      console.log('$onChanges',this.$element[0], this, changes)
      const {checked} = changes
      const radio = this.type === 'radio'
      if (!radio) {
        this.changeModel(angular.copy(this.value))
      } else {
        this.changeModel(angular.copy(this.fValue))
      }

      this.state.required = this.required !== undefined
    }

    changeModel (value) {
      this.state.model = value
    }

    onInnerClick () {
      console.log('onInnerClick', this)
    }

    onInnerChange () {
      console.log('onInnerChange', this)
      this.onChange({
        event: {
          target: this.$element[0].querySelector('input'),
          value: this.state.model
        }
      })
    }
  }

  const component = {
    template,
    controller: MyInput,
    bindings: {
      required: '@',
      type: '@',
      fName: '@',
      // required for: [radio]
      value: '<',
      onChange: '&',
      // required for: [radio]
      checked: '<',
      // required for: [radio]
      fValue: '<'
    }
  }

  angular
    .module('app.form')
    .component('myInput', component)
})()