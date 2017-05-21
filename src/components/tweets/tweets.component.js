(function() {

    class Tweets {

        constructor() {
            this.fetching = null;
        }

        $onInit() {
            // we do have access to mapped action creators.
            this.fetchTweets();
        }

        $onDestroy() {
            if (this.fetching) {

            }
        }
    }

    const component = {
        templateUrl: "components/tweets/tweets.component.html",
        controller: (fluxHelperConnectService, tweetsActionCreators) => {
            return fluxHelperConnectService.connect(
                ({tweets}) => {
                    return {
                        tweets: tweets.items,
                        fetching: tweets.fetching
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