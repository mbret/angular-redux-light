(function() {

    class TweetsService {
        fetchTweets() {
            console.log("TweetsService, fetching tweets...");
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log("TweetsService, tweets has been fetched!");
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
                }, 2000);
            });
        }
    }

    angular
        .module("app.tweets")
        .service("tweetsService", TweetsService)
})();