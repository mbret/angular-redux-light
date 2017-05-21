(function() {
    const tweetsReceived = (tweets) => {
        return {
            type: "TWEETS_RECEIVED",
            tweets
        }
    };

    const fetchTweets = ($injector) => (tweetsService) => {
        return (dispatch, getState) => {
            return tweetsService.fetchTweets()
                .then((tweets) => {
                    dispatch(tweetsReceived(tweets));
                });
        }
    };

    angular
        .module("app.tweets")
        .constant("tweetsActionCreators", {
            fetchTweets,
            tweetsReceived
        });
})();