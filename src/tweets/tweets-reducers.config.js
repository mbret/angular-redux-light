(function() {

    const defaultState = {
        tweets: []
    };

    const tweets = (state = defaultState, action) => {
        switch (action.type) {
            case "TWEETS_RECEIVED":
                return Object.assign({}, state, {
                    tweets: action.tweets
                });
            default:
                return state
        }
    };

    angular
        .module("app.tweets")
        .constant("tweetsReducers", [tweets]);
})();