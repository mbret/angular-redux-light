(function() {
    const tweetsReceived = (items) => {
        return {
            type: "TWEETS_RECEIVED",
            items
        }
    };

    const tweetsFetching = () => {
        return {
            type: "TWEETS_FETCHING"
        }
    };

    /**
     * Fetch tweets (once in a time)
     */
    const fetchTweets = () => (tweetsService, $q) => {
        return (dispatch, getState) => {
            if (!getState().tweets.fetching) {
                dispatch(tweetsFetching());
                return tweetsService.fetchTweets()
                    .then((tweets) => {
                        dispatch(tweetsReceived(tweets));
                    });
            }

            return $q.resolve();
        }
    };

    angular
        .module("app.tweets")
        .constant("tweetsActionCreators", {
            fetchTweets,
            tweetsFetching,
            tweetsReceived
        });
})();