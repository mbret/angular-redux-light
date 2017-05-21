(function() {

    const defaultState = [];

    const tweets = (state = defaultState, action) => {
        switch (action.type) {
            case "TWEETS_RECEIVED":
                return action.tweets;
            default:
                return state
        }
    };

    angular
        .module("app.tweets")
        .constant("tweetsReducers", tweets);
})();