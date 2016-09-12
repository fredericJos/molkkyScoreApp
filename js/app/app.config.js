(function() {
    angular
        .module('molkkyscore')
        .config(configure)
        .run(runBlock);

    configure.$inject = ['$provide', '$translateProvider', '$ionicConfigProvider', 'LANGUAGES_ROOT'];
    runBlock.$inject = ['$rootScope',
                        'IMAGES_ROOT',
                        '$ionicPlatform',
                        'dataService',
                        '$translate',
                        'statisticsService',
                        'loadingService'];

    function configure($provide, $translateProvider, $ionicConfigProvider, LANGUAGES_ROOT) {
        // extend default exceptionHandler
        $provide.decorator('$exceptionHandler', extendExceptionHandler);

        $translateProvider.useStaticFilesLoader({
            prefix: LANGUAGES_ROOT + '/',
            suffix: '.json'
        }).preferredLanguage('english'); // TODO: get from Database

        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.tabs.position('bottom');
    }

    function runBlock($rootScope,
                        IMAGES_ROOT,
                        $ionicPlatform,
                        dataService,
                        $translate,
                        statisticsService,
                        loadingService) {
        $rootScope.imagesRoot = IMAGES_ROOT;

        loadingService.showIndefinite('LOADING-APP');
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                window.StatusBar.styleDefault();
            }

            if (window.cordova) {
                dataService.initDatabase().then(function() {
                    dataService.initPlayers().then(function(players) {
                        players.forEach(function(player) {
                            dataService.initPlayerStatistics(player);
                        });
                    });
                    dataService.initOverallStatistics();
                    dataService.initGameSettings();
                    dataService.initAppSettings().then(function(appSettings) {
                        $translate.use(appSettings.language);
                        $rootScope.$broadcast('appInitialized'); // caught in home.controller.js
                        loadingService.hide();
                    });

                }, function(err) {
                    console.log(err.message);
                });
            }
        });
    }

    /*  FUNCTIONS
    ============================================================ */
    extendExceptionHandler.$inject = ['$delegate'];
    function extendExceptionHandler($delegate) {
        return function(exception, cause) {
            $delegate(exception, cause);
            var errorData = {
                exception: exception,
                cause: cause
            };
            /**
             * Could add the error to a service's collection,
             * add errors to $rootScope, log errors to remote web server,
             * or log locally. Or throw hard. It is entirely up to you.
             * throw exception;
             */
        };
    }
})();
