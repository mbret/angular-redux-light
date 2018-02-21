(function () {

  const template = `
    <div id="form-view">
      <h1>Form</h1>
      <form name="formFlux">
          <p>Valid: {{formFlux.$valid}}</p>
          <p>
            values: {{formFlux.firstName}}
            <hr>
            age: {{formFlux.age}}
            <hr>
            order side: {{formFlux.orderSide}}
          </p>
          <my-input required type="text" f-name="firstName" value="$ctrl.state.firstName" on-change="$ctrl.handleChange(event)"></my-input>
          <my-input required type="number" f-name="age" value="$ctrl.state.age" on-change="$ctrl.handleChange(event)"></my-input>
          <hr>
          <label>Buy <my-input required type="radio" f-name="orderSide" value="'b'" checked="$ctrl.state.orderSide === 'b'" f-value="$ctrl.state.orderSide" on-change="$ctrl.handleChange(event)"></label>
          <label>Sell <my-input required type="radio" f-name="orderSide" value="'s'" checked="$ctrl.state.orderSide === 's'" f-value="$ctrl.state.orderSide" on-change="$ctrl.handleChange(event)"></label>
          <button type="submit" ng-disabled="!formFlux.$valid || $ctrl.state.orderSide === 's'">Valider</button>
      </form>
      
      <hr>
      
      <!--<form name="FormVanilla">-->
          <!--<p>Valid: {{FormVanilla.$valid}}</p>-->
          <!--<p>values: {{FormVanilla.firstName}} </br>age: {{FormVanilla.age}}</p>-->
          <!--<input required type="text" name="firstName" ng-model="$ctrl.state.firstName" />-->
          <!--<input required type="number" name="age" ng-model="$ctrl.state.age" />-->
      <!--</form>-->
    </div>
    `

  class FormView {
    constructor () {
      'ngInject'
      this.state = {
        firstName: undefined,
        age: undefined,
        orderSide: 's'
      }
    }

    $onInit () {
      this.state.firstName = 'toto'
      this.state.age = 10
    }

    handleChange (event) {
      console.log(event)
      console.log('name', event.target.name)
      console.log('value', event.value)

      this.state[event.target.name] = event.value
    }
  }

  const connect = /* @ngInject */ (fluxHelperConnectService) => fluxHelperConnectService.connect(
    ({}) => ({}),
    dispatch => ({})
  )(FormView)

  const component = {
    template,
    controller: connect
  }

  angular
    .module('app.form')
    .component('formView', component)
})()