
Game = {
    activeNPC       : '',
    areaObstacles   : '',
    currentArea     : 'a000',
    currentFocus    : '',
    directions      : {
        up      : 'up',
        down    : 'down',
        left    : 'left',
        right   : 'right'
    },
    fps             : 60,
    gridCellSize    : 32,
    pressedKeys     : [],
    prevArea        : 'a000',

    /**
     *
     */
    calculateZindex: function (object) {
        object.css({
            zIndex: object.offset().top
        });
    },

    /**
     *
     */
    checkButtons: function () {
        var
            player          = $('#player'),
            playerSprite    = $('#player-sprite');

        if (player.length == 0) {
            return;
        }

        var
            allowMove   = player.data('player')['allowMove'],
            direction   = '';

        player.data('player')['speedMultiplier'] = 1;

        // Shift

        if (Game.pressedKeys[16]) {
            player.data('player')['speedMultiplier'] = 2;
        }

        // Spacebar, Enter

        if (Game.pressedKeys[13] || Game.pressedKeys[32]) {
            var npc = Game.checkNPCs(player, player.data('player')['direction']);

            if (npc) {
                npc.npc('talk', npc.data('npc')['dialogue']);
            }
        }

        switch (true) {

            // W, Up Arrow

            case ((Game.pressedKeys[87] || Game.pressedKeys[38])) :
                var direction = player.data('player')['direction'] = Game.directions.up;

                    player.player('move', direction);

                break;

            // S, Down Arrow

            case ((Game.pressedKeys[83] || Game.pressedKeys[40])) :
                var direction = player.data('player')['direction'] = Game.directions.down;

                    player.player('move', direction);

                break;

            // A, Left Arrow

            case ((Game.pressedKeys[65] || Game.pressedKeys[37])) :
                var direction = player.data('player')['direction'] = Game.directions.left;

                    player.player('move', direction);

                break;

            // D, Right Arrow

            case ((Game.pressedKeys[68] || Game.pressedKeys[39])) :
                var direction = player.data('player')['direction'] = Game.directions.right;

                    player.player('move', direction);

                break;

            default:
                playerSprite.removeClass('walking');

                break;
        }
    },

    /**
     *
     */
    checkCollisions: function (object, direction) {
        var objectCoord = Game.getCoordinates(object),
            offsetL     = 0,
            offsetT     = 0;

        switch (direction) {
            case Game.directions.up:
                offsetT = -1;

                break;

            case Game.directions.down:
                offsetT = 1;

                break;

            case Game.directions.left:
                offsetL = -1;

                break;

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

        return false;
    },

    /**
     *
     */
    getCoordinates: function (object) {
        var objectPos = object.position();

        return {
            'x': objectPos.left / Game.gridCellSize,
            'y': objectPos.top / Game.gridCellSize
        }
    },

    /**
     *
     */
    moveObject: function (object, direction, callback) {
        var
            animateOptions  = {},
            objectPos       = object.position(),
            left            = objectPos.left,
            top             = objectPos.top;

        switch (direction) {
            case Game.directions.up:
                animateOptions = {
                    top: top - Game.gridCellSize
                }

                break;

            case Game.directions.down:
                animateOptions = {
                    top: top + Game.gridCellSize
                }

                break;

            case Game.directions.left:
                animateOptions = {
                    left: left - Game.gridCellSize
                }

                break;

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
    start: function () {
        setInterval(function () {
            Game.update();
        }, 1000 / Game.fps);

        Stage.init('a000');

        for (i = 0; i < $('#player, .npc, .object').length; i++) {
            Game.calculateZindex($('#player, .npc, .object').eq(i));
        }
    },

    /**
     *
     */
    update: function () {
        var player = $('#player');

        if (player.length > 0) { // Don't bother updating if there isn't a player
            Game.checkButtons();
        }
    }
};

/** PLAYER **/

function Player () {
    this.allowMove          = true;
    this.direction          = null;
    this.speedMultiplier    = 1;

    /**
     *
     */
    this.create = function (data) {
        var player;

        if (data.properties.prevArea === Game.prevArea) {
            $('#objects').append('<div id="player" tabindex="0" style="left: ' + data.x + 'px; top: ' + (data.y - 32) + 'px;"><div id="player-sprite"></div></div>');

            player = $('#player');

            player.data('player', new Player());

            player.trigger('focus');
        }
    }

    /**
     *
     */
    this.destroy = function () {
        var player = $(this);

        player.remove();
    }

    /**
     *
     */
    this.move = function (direction, callback) {
        var
            player          = $(this),
            playerSprite    = $('#player-sprite');

        if (player.data('player')['allowMove']) {
            var collision = Game.checkCollisions(player, direction);

            playerSprite.removeClass().addClass('walking ' + direction);

            if (collision) {
                switch (true) {
                    case (collision) :
                        playerSprite.removeClass('walking');

                        break;

                    case (collision.is('.doorway')) :
                        player.data('player')['allowMove'] = false;

                        Game.moveObject(player, direction, function () {
                            Stage.init(collision.attr('data-area'));
                        });

                        break;

                    case (collision.is('.stairs')) :
                        player.data('player')['allowMove'] = false;

                        player.player('useStairs', collision.attr('data-direction'), function () {
                            Stage.init(collision.attr('data-area'));
                        });

                        break;
                }
            } else {
                player.data('player')['allowMove'] = false;

                Game.moveObject(player, direction, function () {
                    player.data('player')['allowMove'] = true;
                });

                Stage.scrollStage(direction);
            }
        }
    }

    /**
     *
     */
    this.useStairs = function (direction, callback) {
        var player      = $(this),
            playerPos   = player.position(),
            offsetL     = 0,
            offsetT     = 0;

        switch (direction) {
            case 'dl':
                offsetL = -32;
                offsetT = 0;

                break;

            case 'dr':
                offsetL = 32;
                offsetT = 32;

                break;

            case 'ul':
                offsetL = -32;
                offsetT = -32;

                break;

            case 'ur':
                offsetL = 32;
                offsetT = -32;

                break;
        }

        player.stop().animate({
            left    : playerPos.left + offsetL,
            top     : playerPos.top + offsetT
        }, 180, 'linear', function () {
            if (callback) {
                callback();
            }
        });
    }
}

$.fn.player = function (option) {
    var
        element     = $(this[0]),
        otherArgs   = Array.prototype.slice.call(arguments, 1);

    if (typeof option !== 'undefined' && otherArgs.length > 0) {
        return element.data('player')[option].apply(this[0], [].concat(otherArgs));
    } else if (typeof option !== 'undefined') {
        return element.data('player')[option].call (this[0]);
    } else {
        return element.data('player');
    }
}

$.player = new Player();

//
$(document).on('keydown', function (event) {
    var key = event.keyCode || event.which;

    Game.pressedKeys[event.keyCode] = true;
});

//
$(document).on('keyup', function (event) {
    var key = event.keyCode || event.which;

    Game.pressedKeys[event.keyCode] = false;
});

/** START **/

//
$(document).on('ready', function () {
    Game.start();
});
