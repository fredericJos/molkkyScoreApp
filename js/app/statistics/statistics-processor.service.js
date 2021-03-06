(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('statisticsProcessor', statisticsProcessor);

    statisticsProcessor.$inject = ['gameService', 'settingsService', 'dataService'];

    function statisticsProcessor(gameService, settingsService, dataService) {
        var service = {
            update: update
        };
        return service;

        ////////////////

        function update(event, player, undo) { // player specific updates
            var throws = player.scoreHistory.length;

            switch (event) {
                case 'playerWonGame': updatePlayerWonGame(player, dataService.getOverallStatistics(), undo); break;
                case 'playerReachedMaxScore': updatePlayerReachedMaxScore(player, throws, undo); break;
                case 'playerThrowsSinglePin': updatePlayerThrowsSinglePin(player, undo); break;
                case 'playerThrow': updatePlayerThrow(player, throws, undo); break;
            }

            if (!player.guestColor) {
                dataService.updatePlayerStatistics(player); // player or team
            }
        }

        /*  Helper functions
            ================================================================================= */
        function updatePlayerWonGame(player, overallStatistics, undo) {
            var participants = gameService.getParticipants();
            var increment = undo ? -1 : 1;

            // overall statistics
            dataService.getOverallStatistics().totalGamesPlayed += increment;
            dataService.updateOverallStatistics();

            // update winning player data
            if (!player.guestColor) {
                player.statistics.rawData.gamesWon += increment;
                updatePlayerMetric('totalWins', player);
            }
            // update participants data
            participants.forEach(function(player) {
                if (player.statistics) {
                    player.statistics.rawData.gamesPlayed += increment;
                }
            });
            updatePlayerMetric('winningRatio', participants);
        }

        function updatePlayerReachedMaxScore(player, throws, undo) {
            if (player.guestColor) {
                return;
            }

            var increment = undo ? -1 : 1;
            player.statistics.rawData.gamesReachedMaxScore += increment;
            player.statistics.rawData.throwsInGamesReachedMaxScore += (throws * increment);

            updatePlayerMetric('efficiency', player);
        }

        function updatePlayerThrowsSinglePin(player, undo) {
            if (player.guestColor) {
                return;
            }

            var increment = undo ? -1 : 1;
            player.statistics.rawData.throwsSinglePin += increment;
        }

        function updatePlayerThrow(player, throws, undo) {
            if (player.guestColor) {
                return;
            }

            var increment = undo ? -1 : 1;
            player.statistics.rawData.throws += increment;

            updatePlayerMetric('accuracy', player);
        }

        function updatePlayerMetric(event, player) {
            switch (event) {
                case 'totalWins': updatePlayerMetricTotalWins(player); break;
                case 'winningRatio': updatePlayerMetricWinningRatio(player); break;
                case 'versatility': updatePlayerMetricVersatility(player); break;
                case 'accuracy': updatePlayerMetricAccuracy(player); break;
                case 'efficiency': updatePlayerMetricEfficiency(player); break;
            }
        }

        function updatePlayerMetricTotalWins(player) {
            var gamesWon = player.statistics.rawData.gamesWon;

            player.statistics.metrics.totalWins = gamesWon;
        }

        function updatePlayerMetricVersatility(player) {
            var accuracy = player.statistics.metrics.accuracy;
            var efficiency = player.statistics.metrics.efficiency;
            var winningRatio = player.statistics.metrics.winningRatio;

            player.statistics.metrics.versatility = Math.round((accuracy + efficiency + winningRatio) / 3);
        }

        function updatePlayerMetricWinningRatio(participants) {
            var gamesWon, gamesPlayed;
            participants.forEach(function(player) {
                if (player.statistics) {
                    gamesWon = player.statistics.rawData.gamesWon;
                    gamesPlayed = player.statistics.rawData.gamesPlayed;

                    player.statistics.metrics.winningRatio = Math.round((gamesWon / gamesPlayed) * 100);

                    updatePlayerMetric('versatility', player);
                }
            });
        }

        function updatePlayerMetricAccuracy(player) {
            var totalThrowsThatHitSinglePin = player.statistics.rawData.throwsSinglePin;
            var totalThrows = player.statistics.rawData.throws;

            player.statistics.metrics.accuracy = Math.round((totalThrowsThatHitSinglePin / totalThrows) * 100);

            updatePlayerMetric('versatility', player);
        }

        function updatePlayerMetricEfficiency(player) {
            var minThrowsToWin = getMinThrowsToWin();
            var throwsInGamesReachedMaxScore = player.statistics.rawData.throwsInGamesReachedMaxScore;
            var gamesReachedMaxScore = player.statistics.rawData.gamesReachedMaxScore;
            var throwsPerGameReachedMaxScore = throwsInGamesReachedMaxScore / gamesReachedMaxScore;

            player.statistics.metrics.efficiency = Math.round((minThrowsToWin / throwsPerGameReachedMaxScore) * 100);

            updatePlayerMetric('versatility', player);
        }

        function getMinThrowsToWin() {
            var minThrowsToWin = 0;
            var winningScore = settingsService.getParameters().game.winningScore;
            switch (winningScore) {
                case 25: minThrowsToWin = 3; break;
                case 50: minThrowsToWin = 5; break;
                case 100: minThrowsToWin = 9; break;
            }

            return minThrowsToWin;
        }
    }
})();
