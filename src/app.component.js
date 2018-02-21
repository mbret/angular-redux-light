(function () {

  class App {
    constructor () {

    }
  }

  const component = {
    template: `
        <nav class="navbar navbar-inverse bg-primary">
          <ul class="navbar-nav mr-auto flex-column flex-sm-row">
            <li class="nav-item p-1">
              <button type="button" class="btn btn-success" ng-click="$ctrl.persist()">Persist state</span></button>
            </li>
            <li class="nav-item p-1">
              <button type="button" class="btn btn-success" ng-click="$ctrl.restore()">Restore state</button>
            </li>
          </ul>
        </nav>
        <div>
            <h1>My awesome redux Angular app!</h1>
            <a ui-sref="app.todos">Go home (sync)</a>
            <a ui-sref="app.settings">Go settings (sync)</a>
            <a ui-sref="app.tweets">Go tweets (async)</a>
            <a ui-sref="app.form">Go to form example</a>
            <ui-view></ui-view>
        </div>
    `,
    controller: (fluxHelperConnectService, appCoreRestoreActionCreators) => {
      return fluxHelperConnectService.connect(
        ({tweets}) => {},
        (dispatch) => fluxHelperConnectService.bindActionCreators(appCoreRestoreActionCreators, dispatch)
      )(App);
    }
  }

  angular
    .module('app')
    .component('app', component)
})()