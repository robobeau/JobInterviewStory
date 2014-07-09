
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
        var
            player          = $('#player'),
            playerSprite    = $('#player-sprite');

        player.data('player')['speedMultiplier'] = 1;

        // Shift

        if (Game.pressedKeys[16]) {
            player.data('player')['speedMultiplier'] = 2;
        }

        // Spacebar, Enter

        if (Game.pressedKeys[13] || Game.pressedKeys[32]) {
            var npc = Game.checkNPCs(player, player.data('player')['direction']);

            if (npc == true && player.data('player')['allowMove']) {
                if (npc.is('.npc')) {
                    npc.npc('talk', npc.obstacle.data('npc')['dialogue']);
                }
            }
        }

        switch (true) {

            // W, Up Arrow

            case ((Game.pressedKeys[87] || Game.pressedKeys[38]) && player.data('player')['allowMove']) :
                var direction = 'u';

                player.data('player')['direction'] = direction;

                var collision   = Game.checkCollisions(player, direction),
                    npc         = Game.checkNPCs(player, direction);
                    portal      = Game.checkPortals(player, direction);

                playerSprite.removeClass('down left right').addClass('walking up');

                if (collision == false && npc == false && player.data('player')['allowMove']) {
                    player.data('player')['allowMove'] = false;

                    Game.moveObject(player, direction, function () {
                        player.data('player')['allowMove'] = true;
                    });

                    if (portal) {
                        if (portal.is('.stairs')) {
                            player.player('useStairs', portal.attr('data-direction'));
                        }

                        Stage.init(portal.attr('data-area'));
                    }

                } else {
                    playerSprite.removeClass('walking');
                }

                break;

            // S, Down Arrow

            case ((Game.pressedKeys[83] || Game.pressedKeys[40]) && player.data('player')['allowMove']) :
                var direction = 'd';

                player.data('player')['direction'] = direction;

                var collision   = Game.checkCollisions(player, direction),
                    npc         = Game.checkNPCs(player, direction);
                    portal      = Game.checkPortals(player, direction);

                playerSprite.removeClass('left right up').addClass('walking down');

                if (collision == false && npc == false && player.data('player')['allowMove']) {
                    player.data('player')['allowMove'] = false;

                    Game.moveObject(player, direction, function () {
                        player.data('player')['allowMove'] = true;
                    });

                    if (portal) {
                        if (portal.is('.stairs')) {
                            player.player('useStairs', portal.attr('data-direction'));
                        }

                        Stage.init(portal.attr('data-area'));
                    }

                } else {
                    playerSprite.removeClass('walking');
                }

                break;

            // A, Left Arrow

            case ((Game.pressedKeys[65] || Game.pressedKeys[37]) && player.data('player')['allowMove']) :
                var direction = 'l';

                player.data('player')['direction'] = direction;

                var collision   = Game.checkCollisions(player, direction),
                    npc         = Game.checkNPCs(player, direction);
                    portal      = Game.checkPortals(player, direction);

                playerSprite.removeClass('down right up').addClass('walking left');

                if (collision == false && npc == false && player.data('player')['allowMove']) {
                    player.data('player')['allowMove'] = false;

                    Game.moveObject(player, direction, function () {
                        player.data('player')['allowMove'] = true;
                    });

                    if (portal) {
                        if (portal.is('.stairs')) {
                            player.player('useStairs', portal.attr('data-direction'));
                        }

                        Stage.init(portal.attr('data-area'));
                    }

                } else {
                    playerSprite.removeClass('walking');
                }

                break;

            // D, Right Arrow

            case ((Game.pressedKeys[68] || Game.pressedKeys[39]) && player.data('player')['allowMove']) :
                var direction = 'r';

                player.data('player')['direction'] = direction;

                var collision   = Game.checkCollisions(player, direction),
                    npc         = Game.checkNPCs(player, direction);
                    portal      = Game.checkPortals(player, direction);

                playerSprite.removeClass('down left up').addClass('walking right');

                if (collision == false && npc == false && player.data('player')['allowMove']) {
                    player.data('player')['allowMove'] = false;

                    Game.moveObject(player, direction, function () {
                        player.data('player')['allowMove'] = true;
                    });

                    if (portal) {
                        if (portal.is('.stairs')) {
                            player.player('useStairs', portal.attr('data-direction'));
                        }

                        Stage.init(portal.attr('data-area'));
                    }
                } else {
                    playerSprite.removeClass('walking');
                }

                break;


            default:
                if (player.data('player')['allowMove']) {
                    playerSprite.removeClass('walking');
                }

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
    },

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
        }, 180, 'linear');
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
$(document).on('keydown', '#player', function (event) {
    var key = event.keyCode || event.which;

    Game.pressedKeys[event.keyCode] = true;
});

//
$(document).on('keyup', '#player', function (event) {
    var key = event.keyCode || event.which;

    Game.pressedKeys[event.keyCode] = false;
});

/** START **/

//
$(document).on('ready', function () {
    Game.start();
});
