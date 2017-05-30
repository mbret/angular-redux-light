(function() {

    class TweetsService {
        fetchTweets() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve([
                        {
                            id: 0,
                            author: "Maxime Bret",
                            date: new Date().toISOString(),
                            content: "Omg I just discovered an awesome Angular app guys #angular #redux"
                        },
                        {
                            id: 1,
                            author: "Maxime Bret",
                            date: new Date().toISOString(),
                            content: "Omg I just discovered an awesome Angular app guys #angular #redux"
                        }
                    ]);
                }, 3000);
            });
        }
    }

    angular
        .module("app.tweets")
        .service("tweetsService", TweetsService)
})();