// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'molkkyscore' is the name of this angular module example (also set in a <body> attribute in index.html)
angular.module('molkkyscore', ['ionic', 'ngCordova']);

(function() {
    angular
        .module('molkkyscore')
        .config(configure)
        .run(runBlock);

    configure.$inject = ['$provide'];
    runBlock.$inject = ['$rootScope', 'IMAGES_ROOT', '$ionicPlatform', '$cordovaSQLite'];

    function configure($provide) {
        // extend default exceptionHandler
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    function runBlock($rootScope, IMAGES_ROOT, $ionicPlatform, $cordovaSQLite) {
        $rootScope.imagesRoot = IMAGES_ROOT;

        $ionicPlatform.ready(function() {
            // console.log('test');
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
            testDb();

            function testDb() {
                console.log('tester');
                var db = $cordovaSQLite.openDB({
                    name: 'my.db', location: 'default'
                });
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS people' +
                    ' (id integer primary key, firstname text, lastname text)');

                var query = 'INSERT INTO people (firstname, lastname) VALUES (?,?)';
                $cordovaSQLite.execute(db, query, ['firstname', 'firstname']).then(function(res) {
                    console.log('INSERT ID -> ' + res.insertId);
                }, function (err) {
                    console.error(err.message);
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

(function() {
    angular
        .module('molkkyscore')
        .config(router);

    router.$inject = ['TEMPLATES_ROOT', '$stateProvider', '$urlRouterProvider'];

    function router(TEMPLATES_ROOT, $stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: TEMPLATES_ROOT + '/layout/tabs.html'
            })

            // Each tab has its own nav history stack:

            .state('tab.home', {
                url: '/home',
                views: {
                    'home': {
                        templateUrl: TEMPLATES_ROOT + '/home/home.html',
                        controller: 'HomeCtrl as home'
                    }
                }
            })
            .state('tab.settings', {
                url: '/home/settings',
                templateUrl: TEMPLATES_ROOT + '/settings/settings.html',
                views: {
                    'home': {
                        templateUrl: TEMPLATES_ROOT + '/settings/settings.html',
                        controller: 'SettingsCtrl as settings'
                    }
                }
            })
            .state('tab.statistics', {
                url: '/statistics',
                views: {
                    'statistics': {
                        templateUrl: TEMPLATES_ROOT + '/statistics/statistics.html',
                        controller: 'StatisticsCtrl as statistics'
                    }
                }
            })
            .state('tab.statistics-listing', {
                url: '/statistics/listing',
                views: {
                    'statistics': {
                        templateUrl: TEMPLATES_ROOT + '/statistics/statistics-listing.html',
                        controller: 'StatisticsListingCtrl as listing'
                    }
                }
            })
            .state('tab.players', {
                url: '/players',
                views: {
                    'players': {
                        templateUrl: TEMPLATES_ROOT + '/players/players.html',
                        controller: 'PlayersCtrl as players'
                    }
                }
            })
            .state('tab.player-detail', {
                url: '/players/:playerId',
                views: {
                    'players': {
                        templateUrl: TEMPLATES_ROOT + '/players/player-detail.html',
                        controller: 'PlayerDetailCtrl as playerDetail'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/home');
    }
})();

(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .constant('TEMPLATES_ROOT', '/templates')
        .constant('IMAGES_ROOT', '/img');
})();

(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = [];

    function HomeCtrl() {
        /* jshint validthis: true */
        var vm = this;

        activate();

        ////////////////

        function activate() {
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('PlayerDetailCtrl', PlayerDetailCtrl);

    PlayerDetailCtrl.$inject = ['$stateParams', 'playersService'];

    function PlayerDetailCtrl($stateParams, playersService) {
        /* jshint validthis: true */
        var vm = this;

        vm.player = playersService.get($stateParams.playerId);

        activate();

        ////////////////

        function activate() {
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('PlayersCtrl', PlayersCtrl);

    PlayersCtrl.$inject = ['playersService'];

    function PlayersCtrl(playersService) {
        /* jshint validthis: true */
        var vm = this;

        vm.players = playersService.all();
        vm.remove = remove;

        activate();

        ////////////////

        function activate() {
        }

        function remove(player) {
            playersService.remove(player);
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('playersService', playersService);

    playersService.$inject = [];

    function playersService() {
        // Some fake testing data
        var players = [
            {
                id: 0,
                name: 'Ben Sparrow',
                lastText: 'You on your way?',
                face: 'img/ben.png'
            },
            {
                id: 1,
                name: 'Max Lynx',
                lastText: 'Hey, it\'s me',
                face: 'img/max.png'
            },
            {
                id: 2,
                name: 'Adam Bradleyson',
                lastText: 'I should buy a boat',
                face: 'img/adam.jpg'
            },
            {
                id: 3,
                name: 'Perry Governor',
                lastText: 'Look at my mukluks!',
                face: 'img/perry.png'
            },
            {
                id: 4,
                name: 'Mike Harrington',
                lastText: 'This is wicked good ice cream.',
                face: 'img/mike.png'
            }
        ];

        var service = {
            all: all,
            get: get,
            remove: remove
        };
        return service;

        ////////////////

        function all() {
            return players;
        }

        function get(playerId) {
            for (var i = 0; i < players.length; i++) {
                if (players[i].id === parseInt(playerId)) {
                    return players[i];
                }
            }
            return null;
        }

        function remove(player) {
            players.splice(players.indexOf(player), 1);
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['$ionicNavBarDelegate', '$ionicHistory', '$timeout'];

    function SettingsCtrl($ionicNavBarDelegate, $ionicHistory, $timeout) {
        /* jshint validthis: true */
        var vm = this;

        vm.activateTab = activateTab;

        vm.activeTabIndex = 0;

        activate();

        ////////////////

        function activate() {
        }

        function activateTab(index) {
            vm.activeTabIndex = index;

        }
    }
})();

(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('StatisticsListingCtrl', StatisticsListing);

    StatisticsListing.$inject = [];

    function StatisticsListing() {
        /* jshint validthis: true */
        var vm = this;

        vm.test = 'test listing';

        activate();

        ////////////////

        function activate() {
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('StatisticsCtrl', StatisticsCtrl);

    StatisticsCtrl.$inject = [];

    function StatisticsCtrl() {
        /* jshint validthis: true */
        var vm = this;

        vm.test = 'test statistics';

        activate();

        ////////////////

        function activate() {
        }
    }
})();
