(function () {

  const factory = (tweetsService, $q) => {
    'ngInject'

    const tweetsReceived = (items) => {
      return {
        type: '@app/TWEETS_RECEIVED',
        items,
      }
    }

    const tweetsFetching = () => {
      return {
        type: '@app/TWEETS_FETCHING',
      }
    }

    /**
     * Fetch tweets (once in a time)
     */
    const fetchTweets = () => {
      return (dispatch, getState) => {
        if (getState().tweets.state !== 'fetching') {
          dispatch(tweetsFetching())
          return tweetsService
            .fetchTweets()
            .then((tweets) => {
              dispatch(tweetsReceived(tweets))
            })
        }

        return $q.resolve()
      }
    }

    return {
      fetchTweets,
      tweetsFetching,
      tweetsReceived,
    }
  }

  angular
    .module('app.tweets')
    .factory('tweetsActionCreators', factory)
})()