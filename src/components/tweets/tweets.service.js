(function() {

    class TweetsService {
        fetchTweets() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve([
                        {
                            author: "Maxime Bret",
                            date: new Date(),
                            content: "Omg I just discovered an awesome Angular app guys #angular #redux"
                        },
                        {
                            author: "Maxime Bret",
                            date: new Date(),
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