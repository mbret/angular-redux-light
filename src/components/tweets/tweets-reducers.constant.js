(function() {

    const defaultState = {
        items: [],
        fetching: false
    };

    const tweets = (state = defaultState, action) => {
        switch (action.type) {
            case "TWEETS_RECEIVED":
                return Object.assign({}, state, {
                    items: action.items,
                    fetching: false
                });
            case "TWEETS_FETCHING":
                return Object.assign({}, state, {
                    fetching: true
                })
            default:
                return state
        }
    };

    angular
        .module("app.tweets")
        .constant("tweetsReducers", tweets);
})();