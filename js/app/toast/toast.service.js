(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('toast', toast);

    toast.$inject = ['$cordovaToast', '$translate'];

    function toast($cordovaToast, $translate) {
        var service = {
            show: show,
            getMessages: getMessages
        };
        return service;

        ////////////////

        function show(message) {
            if (!window.cordova) {
                return;
            }

            $cordovaToast.showWithOptions({
                message: message,
                duration: 'short',
                position: 'top',
                styling: {
                    cornerRadius: 4
                }
            });
        }

        function getMessages() {
            return {
                start: {
                    maxParticipants: $translate.instant('HOME.START.TOASTS.MAX-PARTICIPANTS')
                },
                game: {
                    undoLast: $translate.instant('HOME.GAME.TOASTS.UNDO-LAST'),
                    threeMisses: $translate.instant('HOME.GAME.TOASTS.THREE-MISSES'),
                    maxScoreExceeded: $translate.instant('HOME.GAME.TOASTS.MAX-SCORE-EXCEEDED'),
                    winner: $translate.instant('HOME.GAME.TOASTS.WINNER')
                },
                players: {
                    addPlayer: $translate.instant('HOME.PLAYERS.TOASTS.ADD-PLAYER'),
                    removePlayer: $translate.instant('HOME.PLAYERS.TOASTS.REMOVE-PLAYER'),
                    addTeam: $translate.instant('HOME.PLAYERS.TOASTS.ADD-TEAM'),
                    removeTeam: $translate.instant('HOME.PLAYERS.TOASTS.REMOVE-TEAM'),
                    requiredFields: $translate.instant('HOME.PLAYERS.TOASTS.REQUIRED-FIELDS'),
                    updateSaved: $translate.instant('HOME.PLAYERS.TOASTS.UPDATE-SAVED'),
                    zeroTeam: $translate.instant('HOME.PLAYERS.TOASTS.ZERO-TEAM'),
                    teamExists: $translate.instant('HOME.PLAYERS.TOASTS.TEAM-EXISTS'),
                    maxTeam: $translate.instant('HOME.PLAYERS.TOASTS.MAX-TEAM')
                },
                settings: {
                    update: $translate.instant('HOME.SETTINGS.TOASTS.UPDATE')
                }
            };
        }
    }
})();
