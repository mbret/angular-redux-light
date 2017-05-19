(function() {
    class Tweets {
        constructor(tweetsService) {
            this.tweetsService = tweetsService;
        }

        $onInit() {
            this.tweetsService.fetchTweets();
        }
    }

    const component = {
        templateUrl: "tweets/tweets.component.html",
        controller: (store) => {
            return store.connect(
                (state) => {
                    return {
                        tweets: state.tweets
                    };
                }
            )(Tweets);
        }
    };

    angular
        .module("app")
        .component("tweets", component)
})();