(function () {

  /**
   * Tweets are fetching as soon as the component start.
   * We don't need to worry about canceling the async operation on component exit because the binding
   * will be disconnected and all logic is done inside action creator. The component does not care anymore and that's the point.
   */
  class Tweets {
    $onInit () {
      // we do have access to mapped action creators.
      this.fetchTweets()
    }
  }

  const component = {
    templateUrl: 'components/tweets/tweets.component.html',
    controller: (fluxHelperConnectService, tweetsActionCreators) => {
      return fluxHelperConnectService.connect(
        ({tweets}) => {
          return {
            tweets: tweets.items,
            tweetsState: tweets.state
          }
        },
        (dispatch) => fluxHelperConnectService.bindActionCreators(tweetsActionCreators, dispatch)
      )(Tweets)
    }
  }

  angular
    .module('app')
    .component('tweets', component)
})()