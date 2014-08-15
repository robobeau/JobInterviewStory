
/** GAME ******************************************************************************************/

Game = {
    activeNPC          : '',
    currentArea        : 'a000',
    currentDirection   : 'down',
    currentFocus       : '',
    domain             : location.protocol + '//' + location.host,
    directions         : {
        up      : 'up',
        down    : 'down',
        left    : 'left',
        right   : 'right'
    },
    fps                : 60,
    gridCellSize       : 32,
    loading            : 0,
    preloading         : false,
    pressedKeys        : [],
    prevArea           : 'a000',

    /**
     *
     */
    calculateZindex : function (object) {
        object.css({
            zIndex: object.position().top
        });
    },

    /**
     *
     */
    checkCollisions : function (object, direction) {
        var
            objectCoord = Game.getCoordinates(object),
            offsetL     = 0,
            offsetT     = 0;

        switch (direction) {

            // Up
            case Game.directions.up:
                offsetT = -1;

                break;

            // Down
            case Game.directions.down:
                offsetT = 1;

                break;

            // Left
            case Game.directions.left:
                offsetL = -1;

                break;

            // Right
            case Game.directions.right:
                offsetL = 1;

                break;
        }

        if (Stage.collisionsMap[objectCoord.y + offsetT]) {
            if (Stage.collisionsMap[objectCoord.y + offsetT][objectCoord.x + offsetL]) {
                return Stage.collisionsMap[objectCoord.y + offsetT][objectCoord.x + offsetL];
            }
        }

        if (Stage.portalsMap[objectCoord.y + offsetT]) {
            if (Stage.portalsMap[objectCoord.y + offsetT][objectCoord.x + offsetL]) {
                return Stage.portalsMap[objectCoord.y + offsetT][objectCoord.x + offsetL];
            }
        }

        if (Stage.npcsMap[objectCoord.y + offsetT]) {
            if (Stage.npcsMap[objectCoord.y + offsetT][objectCoord.x + offsetL]) {
                return Stage.npcsMap[objectCoord.y + offsetT][objectCoord.x + offsetL];
            }
        }

        if (Stage.playersMap[objectCoord.y + offsetT]) {
            if (Stage.playersMap[objectCoord.y + offsetT][objectCoord.x + offsetL]) {
                return Stage.playersMap[objectCoord.y + offsetT][objectCoord.x + offsetL];
            }
        }

        return false;
    },

    /**
     *
     */
    getCoordinates : function (object) {
        var objectPos = object.position();

        return {
            'x': objectPos.left / Game.gridCellSize,
            'y': objectPos.top / Game.gridCellSize
        }
    },

    /**
     *
     */
    moveObject : function (object, direction, callback) {
        var
            animateOptions  = {},
            objectPos       = object.position(),
            left            = objectPos.left,
            top             = objectPos.top;

        switch (direction) {

            // Up
            case Game.directions.up:
                animateOptions = {
                    top: top - Game.gridCellSize
                }

                break;

            // Down
            case Game.directions.down:
                animateOptions = {
                    top: top + Game.gridCellSize
                }

                break;

            // Left
            case Game.directions.left:
                animateOptions = {
                    left: left - Game.gridCellSize
                }

                break;

            // Right
            case Game.directions.right:
                animateOptions = {
                    left: left + Game.gridCellSize
                }

                break;

        }

        object.stop().animate(
            animateOptions,
            180,
            'linear',
            function () {
                Game.calculateZindex(object);

                if (callback) {
                    callback();
                }
            }
        );
    },

    /**
     *
     */
    preload : function () {
        var preload = [
                // Tile Map
                '../img/tile-map.gif',

                // Player
                '../img/rene-down.gif',
                '../img/rene-down-walking.gif',
                '../img/rene-left.gif',
                '../img/rene-left-walking.gif',
                '../img/rene-up.gif',
                '../img/rene-up-walking.gif',

                // NPC
                '../img/dude.gif',

                // Modals
                '../img/modal-border.gif',

                // Emotes
                '../img/emote-happiness.gif',
                '../img/emote-love.gif',
                '../img/emote-question.gif',
                '../img/emote-sadness.gif',
                '../img/emote-talk-angry.gif',
                '../img/emote-talk-happy.gif',
                '../img/emote-think.gif',

                // Icons
                '../img/icon-continue.gif'
            ],
            outstanding = preload.length;

        Game.preloading = true;

        if ($('#loading').length == 0) {
            $('body').append('<div id="loading">Loading...</div>');
        }

        $.each(preload, function (index, value) {
            Game.loading = true;

            $.ajax({
                type    : 'GET',
                url     : value
            }).done(function () {
                // Do nothing
            }).fail(function () {
                // Do nothing
            }).always(function () {
                outstanding--;

                if (outstanding === 0) {
                    Game.loading = false;

                    Game.start();
                }
            });
        });
    },

    /**
     *
     */
    start : function () {
        setInterval(function () {
            Game.update();
        }, 1000 / Game.fps);

        Stage.init('a000');
    },

    /**
     *
     */
    update : function () {
        if (Game.loading) {
            if ($('#loading').length == 0) {
                $('body').append('<div id="loading">Loading...</div>');
            }
        } else {
            $('#loading').remove();
        }

        if ($('.modal').length > 0) {
            $.modals.checkButtons();
        }

        if ($('#player').length > 0) {
            $.player.checkButtons();
        }

        Stage.checkButtons();
    }
};

/** BINDINGS **************************************************************************************/

//
$(document).on('keydown', function (event) {
    event.preventDefault();

    var key = event.keyCode || event.which;

    Game.pressedKeys[event.keyCode] = true;
});

//
$(document).on('keyup', function (event) {
    event.preventDefault();

    var key = event.keyCode || event.which;

    Game.pressedKeys[event.keyCode]     = false;
    $.modals.allowPress                 = true;
    $.player.allowPress                 = true;
});

/** GAME START! ***********************************************************************************/

//
$(document).on('ready', function () {
    Game.preload();
});
