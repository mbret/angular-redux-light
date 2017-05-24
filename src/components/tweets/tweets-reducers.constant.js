(function () {

  const defaultState = {
    items: [],
    // fetching = already fetching (we d'ont need to fetch again)
    // null = we can fetch as soon as we can
    state: null
  }

  const tweets = (state = defaultState, action) => {
    switch (action.type) {
      case '@app/TWEETS_RECEIVED':
        return Object.assign({}, state, {
          items: action.items,
          state: null
        })
      case '@app/TWEETS_FETCHING':
        return Object.assign({}, state, {
          state: 'fetching'
        })
      default:
        return state
    }
  }

  angular
    .module('app.tweets')
    .constant('tweetsReducers', tweets)
})()