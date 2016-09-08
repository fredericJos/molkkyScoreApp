(function() {
    'use strict';

    angular
        .module('molkkyscore')
        .factory('modalsService', modalsService);

    modalsService.$inject = ['TEMPLATES_ROOT',
                                '$rootScope',
                                '$ionicModal',
                                'gameService',
                                'playersService',
                                'toast',
                                'loadingService'];

    function modalsService(TEMPLATES_ROOT,
                            $rootScope,
                            $ionicModal,
                            gameService,
                            playersService,
                            toast,
                            loadingService) {
        /*  Service for creating modals that are used in more than one controller
            ====================================================================== */
        var toastMessages = toast.getMessages().start;

        var service = {
            getAddPlayersToGameModal: getAddPlayersToGameModal,
            initScoreDetailsModal: initScoreDetailsModal
        };

        /*  LISTENERS
            ======================================================================================== */
        $rootScope.$on('$translateChangeSuccess', function () {
            toastMessages = toast.getMessages().start;
        });

        return service;

        ////////////////

        function getAddPlayersToGameModal($scope, modalConfirmFunction) {
            /*  ==================================================================
            This modal gets a shallow copy of players from playersService as input,
            and outputs a shallow copy of participants to gameService
            ====================================================================== */
            var addPlayersToGameModal = {};
            var modalScope = $scope.$new(true);
            var guestColors = getGuestColors();

            return $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/modals/modal-start-players.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            })
            .then(function(modal) {
                addPlayersToGameModal = modal;

                /*  ==================================================================
                - modal template should reference 'viewModel' as its scope
                - viewModel data is initialized (reset) each time modal is shown
                ====================================================================== */
                modalScope.viewModel = {
                    showReorder: false,
                    guestColors: guestColors,
                    playersInDatabase: playersService.all().slice(), // modal input
                    participants: [], // modal output
                    addPlayerToParticipants: addPlayerToParticipants,
                    addGuestParticipant: addGuestParticipant,
                    removePlayerFromParticipants: removePlayerFromParticipants,
                    reorderParticipant: reorderParticipant,
                    cancelAddPlayersToGame: cancelAddPlayersToGame,
                    startGame: startGame
                };

                /*  LISTENERS
                ======================================================================================== */
                modalScope.$on('modal.hidden', function() {
                    resetAddPlayersToGameModal();
                });

                return addPlayersToGameModal;
            });

            /*  FUNCTIONS
                ======================================================================================== */
            function addPlayerToParticipants(newParticipant) {
                if (modalScope.viewModel.participants.length === 8) {
                    toast.show(toastMessages.maxParticipants);
                    return;
                }

                var playerIndex = _.findIndex(modalScope.viewModel.playersInDatabase, function(player) {
                    return player.id === newParticipant.id;
                });
                var playerFromDatabase = modalScope.viewModel.playersInDatabase.splice(playerIndex, 1)[0];
                modalScope.viewModel.participants.push(playerFromDatabase);
            }

            function addGuestParticipant() {
                if (modalScope.viewModel.participants.length === 8) {
                    toast.show(toastMessages.maxParticipants);
                    return;
                }

                var guestColor = pickRandomGuestColor();

                modalScope.viewModel.participants.push({
                    firstName: 'Mr.',
                    lastName: capitalizeFirstLetter(guestColor),
                    tagline: 'I\'m a guest player',
                    guestColor: guestColor
                });
            }

            function removePlayerFromParticipants(index) {
                var removedPlayer = modalScope.viewModel.participants.splice(index, 1)[0];

                if (removedPlayer.guestColor) {
                    modalScope.viewModel.guestColors.push(removedPlayer.guestColor);
                }
                else {
                    modalScope.viewModel.playersInDatabase.push(removedPlayer);
                }
            }

            function reorderParticipant(player, fromIndex, toIndex) {
                modalScope.viewModel.participants.splice(fromIndex, 1);
                modalScope.viewModel.participants.splice(toIndex, 0, player);
            }

            function cancelAddPlayersToGame() {
                addPlayersToGameModal.hide();
            }

            function startGame() {
                gameService.setParticipants(modalScope.viewModel.participants.slice());

                loadingService.show('STARTING-GAME');

                addPlayersToGameModal.hide()
                .then(function() {
                    modalConfirmFunction();
                });
            }

            /*  Helper functions
            ======================================================================================== */
            function resetAddPlayersToGameModal() {
                modalScope.viewModel.showReorder = false;
                modalScope.viewModel.guestColors = getGuestColors();
                modalScope.viewModel.playersInDatabase = playersService.all().slice();
                modalScope.viewModel.participants = [];
            }

            function pickRandomGuestColor() {
                var colorIndex = Math.floor(Math.random() * modalScope.viewModel.guestColors.length);

                return modalScope.viewModel.guestColors.splice(colorIndex, 1)[0];
            }

            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        }

        function initScoreDetailsModal($scope) {
            return $ionicModal.fromTemplateUrl(TEMPLATES_ROOT + '/game/modal-score-details.html', {
                scope: $scope,
                animation: 'slide-in-up'
            });
        }

        function getGuestColors() {
            return ['blonde', 'orange', 'pink', 'white', 'brown', 'blue', 'green', 'purple'];
        }
    }
})();
