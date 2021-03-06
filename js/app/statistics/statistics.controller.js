(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .controller('StatisticsCtrl', StatisticsCtrl);

    StatisticsCtrl.$inject = ['$scope',
                                'statisticsService',
                                'settingsService',
                                'playersService',
                                'TEMPLATES_ROOT',
                                '$ionicPopover',
                                '$ionicModal'];

    function StatisticsCtrl($scope, statisticsService, settingsService, playersService, TEMPLATES_ROOT, $ionicPopover, $ionicModal) {
        /* jshint validthis: true */
        var vm = this;
        var statisticsInfoModalScope = $scope.$new(true);
        var statsItemsInfoPopoverScope = $scope.$new(true);

        vm.metrics = statisticsService.getMetrics();
        vm.overallStatistics = statisticsService.getOverallStatistics();
        vm.gameSettings = settingsService.getParameters().game;
        vm.statisticsInfoModal = {};
        vm.statsItemsInfoPopover = {};
        vm.showItemInfo = showItemInfo;
        vm.teams = playersService.allTeams();

        activate();

        ////////////////

        function activate() {
            initStatisticsInfoModal();
            initStatsItemsInfoPopover();
        }

        /*  FUNCTIONS
            ======================================================================================== */
        function initStatisticsInfoModal() {
            $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/statistics/modal-statistics-info.html', {
                scope: statisticsInfoModalScope,
                animation: 'slide-in-up'
            })
            .then(function(modal) {
                vm.statisticsInfoModal = modal;

                /*  ==================================================================
                - modal template should reference 'viewModel' as its scope
                ================================================================== */
                statisticsInfoModalScope.viewModel = {
                    modal: vm.statisticsInfoModal
                };
            });
        }

        function initStatsItemsInfoPopover() {
            statsItemsInfoPopoverScope.$on('popover.hidden', function() {
                angular.element(document).find('body').removeClass('popover-open');
            });

            $ionicPopover.fromTemplateUrl(TEMPLATES_ROOT + '/statistics/popover-statistics-item-info.html', {
                scope: statsItemsInfoPopoverScope
            }).then(function(popover) {
                vm.statsItemsInfoPopover = popover;
            });

            /*  ==================================================================
                - popover template should reference 'viewModel' as its scope
                - viewModel data is initialized (reset) each time popover is shown
                ================================================================== */
            statsItemsInfoPopoverScope.viewModel = {
                metric: {}
            };
        }

        function showItemInfo($event, metric) {
            statsItemsInfoPopoverScope.viewModel.metric = metric;

            vm.statsItemsInfoPopover.show($event);

            $event.stopPropagation();
            $event.preventDefault();
        }
    }
})();
