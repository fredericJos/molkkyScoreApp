(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('gameService', gameService);

    gameService.$inject = ['$filter', 'playersService', 'dataService'];

    function gameService($filter, playersService, dataService) {
        var participants = [];
        var tutorial = {};
        var teamMode = false;

        var service = {
            setParticipants: setParticipants,
            setTeamMode: setTeamMode,
            getParticipants: getParticipants,
            isTeamMode: isTeamMode,
            initParticipants: initParticipants,
            sortParticipantsOnScore: sortParticipantsOnScore,
            initScoreboard: initScoreboard,
            getTutorial: getTutorial,
            updateTutorial: updateTutorial
        };
        return service;

        ////////////////

        function setParticipants(newParticipants) {
            participants = newParticipants;
        }

        function setTeamMode(teamModeParam) {
            teamMode = teamModeParam;
        }

        function getParticipants() {
            return participants;
        }

        function isTeamMode() {
            return teamMode;
        }

        function initParticipants() {
            participants.forEach(function(participant) {
                delete participant.zapIndexes;
                participant.score = 0;
                participant.scoreHistory = [];
                participant.accumulatedScoreHistory = [];
                participant.missesInARow = 0;
                participant.finishedGame = false;
                participant.disqualified = false;
                participant.endPosition = -1;
                participant.activedAvatarStatus = '';
                if (teamMode && !participant.guestColor) {
                    participant.activeMemberIndex = 0;
                    participant.players = $filter('orderBy')(participant.players, 'firstName'); // order needs to match avatar in template
                }
            });

            return participants;
        }

        function sortParticipantsOnScore() {
            participants.sort(function(participantOne, participantTwo) {
                if (participantOne.score < participantTwo.score) {
                    return 1;
                }
                else if (participantOne.score > participantTwo.score) {
                    return -1;
                } // score is equal
                else if (participantOne.endPosition > participantTwo.endPosition) {
                    return 1;
                }
                else if (participantOne.endPosition < participantTwo.endPosition) {
                    return -1;
                }
                else {
                    return 0; // both score and andPosition are equal
                }
            });

            return participants;
        }

        function initScoreboard(scoreboard) {
            scoreboard.rowOne = participants.slice(0, 4);
            scoreboard.rowTwo = participants.slice(4, 8);

            switch (participants.length) {
                case 2: scoreboard.colWidthPercentage = 50; break;
                case 3: scoreboard.colWidthPercentage = 33; break;
                default: scoreboard.colWidthPercentage = 25;
            }

            return scoreboard;
        }

        function getTutorial() {
            if (_.isEmpty(tutorial)) {
                tutorial = dataService.getGameTutorial();
            }

            return tutorial;
        }

        function updateTutorial() {
            dataService.updateGameTutorial();
        }
    }
})();
