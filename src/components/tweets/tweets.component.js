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
        controller: (fluxHelpersConnectService, tweetsActionCreators) => {
            return fluxHelpersConnectService.connect(
                ({tweets}) => {
                    return {
                        tweets
                    };
                },
                (dispatch) => fluxHelpersConnectService.bindActionCreators(tweetsActionCreators, dispatch)
            )(Tweets);
        }
    };

    angular
        .module("app")
        .component("tweets", component)
})();