(function() {

    class TweetsService {
        constructor($rootScope, $timeout, $q) {
            this.$rootScope = $rootScope;
            this.$timeout = $timeout;
            this.$q = $q;
        }

        fetchTweets() {
            console.log("TweetsService, fetching tweets...");
            return this.$q((resolve) => {
                this.$timeout(() => {
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

        fetchSyncTweets() {
            return [
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
            ];
        }
    }

    angular
        .module("app.tweets")
        .service("tweetsService", TweetsService)
})();