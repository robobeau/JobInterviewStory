
Game = {
    activeNPC       : '',
    areaObstacles   : '',
    currentArea     : 'a000',
    directions      : [
        'u',
        'd',
        'l',
        'r'
    ],
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
        var player = $('#player');

        if (player.length == 0) {
            return;
        }

        var
            allowMove       = player.data('player')['allowMove'],
            direction,
            playerSprite    = $('#player-sprite');

        player.data('player')['speedMultiplier'] = 1;

        // Shift

        if (Game.pressedKeys[16]) {
            player.data('player')['speedMultiplier'] = 2;
        }

        if (allowMove) {

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
                    direction = player.data('player')['direction'] = 'u';

                    playerSprite.removeClass('down left right').addClass('walking up');

                    break;

                // S, Down Arrow

                case ((Game.pressedKeys[83] || Game.pressedKeys[40])) :
                    direction = player.data('player')['direction'] = 'd';

                    playerSprite.removeClass('left right up').addClass('walking down');

                    break;

                // A, Left Arrow

                case ((Game.pressedKeys[65] || Game.pressedKeys[37])) :
                    direction = player.data('player')['direction'] = 'l';

                    playerSprite.removeClass('down right up').addClass('walking left');

                    break;

                // D, Right Arrow

                case ((Game.pressedKeys[68] || Game.pressedKeys[39])) :
                    direction = player.data('player')['direction'] = 'r';

                    playerSprite.removeClass('down left up').addClass('walking right');

                    break;

                default:
                    playerSprite.removeClass('walking');

                    break;
            }

            collision   = Game.checkCollisions(player, direction);
            npc         = Game.checkNPCs(player, direction);

            if (collision == false && npc == false) {
                Game.moveChecks(player, direction, collision, npc);
            } else {
                playerSprite.removeClass('walking');
            }

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
            case 'u':
                offsetT = -1;

                break;

            case 'd':
                offsetT = 1;

                break;

            case 'l':
                offsetL = -1;

                break;

            case 'r':
                offsetL = 1;

                break;
        }

        if (Stage.collisionsMap[objectCoord.y + offsetT]) {
            return Stage.collisionsMap[objectCoord.y + offsetT][objectCoord.x + offsetL];
        }

        return false;
    },

    /**
     *
     */
    checkNPCs: function (npc, direction) {
        var npcCoord = Game.getCoordinates(npc),
            offsetL     = 0,
            offsetT     = 0;

        switch (direction) {            case 'u':
                offsetT = -1;

                break;

            case 'd':
                offsetT = 1;

                break;

            case 'l':
                offsetL = -1;

                break;

            case 'r':
                offsetL = 1;

                break;
        }

        if (Stage.npcsMap[npcCoord.y + offsetT]) {
            if (Stage.npcsMap[npcCoord.y + offsetT][npcCoord.x + offsetL]) {
                return Stage.npcsMap[npcCoord.y + offsetT][npcCoord.x + offsetL];
            }
        }

        return false;
    },

    /**
     *
     */
    checkPortals: function (object, direction) {
        var objectCoord = Game.getCoordinates(object),
            offsetL     = 0,
            offsetT     = 0;

        switch (direction) {
            case 'u':
                offsetT = -1;

                break;

            case 'd':
                offsetT = 1;

                break;

            case 'l':
                offsetL = -1;

                break;

            case 'r':
                offsetL = 1;

                break;
        }

        if (Stage.portalsMap[objectCoord.y + offsetT]) {
            return Stage.portalsMap[objectCoord.y + offsetT][objectCoord.x + offsetL];
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
    moveChecks: function (player, direction, collision, npc) {
        var portal = Game.checkPortals(player, direction);

        player.data('player')['allowMove'] = false;

        if (portal) {
            switch (true) {
                case (portal.is('.doorway')) :
                    Game.moveObject(player, direction, function () {
                        Stage.init(portal.attr('data-area'));
                    });

                    break;

                case (portal.is('.stairs')) :
                    player.player('useStairs', portal.attr('data-direction'), function () {
                        Stage.init(portal.attr('data-area'));
                    });

                    break;
            }
        } else {
            Game.moveObject(player, direction, function () {
                player.data('player')['allowMove'] = true;
            });
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
            case 'u':
                animateOptions = {
                    top: top - 32
                }

                break;

            case 'd':
                animateOptions = {
                    top: top + 32
                }

                break;

            case 'l':
                animateOptions = {
                    left: left - 32
                }

                break;

            case 'r':
                animateOptions = {
                    left: left + 32
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

        if (object.is('#player')) {
            Stage.scrollStage(direction);
        }
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
