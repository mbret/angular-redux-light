(function() {

    class Tweets {

        constructor() {

        }

        $onInit() {
            // we do have access to mapped action creators.
            this.fetchTweets();
        }
    }

    const component = {
        templateUrl: "components/tweets/tweets.component.html",
        controller: (fluxHelperConnectService, tweetsActionCreators) => {
            return fluxHelperConnectService.connect(
                ({tweets}) => {
                    return {
                        tweets
                    };
                },
                (dispatch) => fluxHelperConnectService.bindActionCreators(tweetsActionCreators, dispatch)
            )(Tweets);
        }
    };

    angular
        .module("app")
        .component("tweets", component)
})();