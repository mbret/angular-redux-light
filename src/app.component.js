(function () {

  class App {
    constructor () {

    }
  }

  const component = {
    template: `
        <div>
            <h1>My awesome redux Angular app!</h1>
            <a ui-sref="app.todos">Go home (sync)</a>
            <a ui-sref="app.settings">Go settings (sync)</a>
            <a ui-sref="app.tweets">Go tweets (async)</a>
            <ui-view></ui-view>
        </div>
    `,
    controller: App,
  }

  angular
    .module('app')
    .component('app', component)
})()