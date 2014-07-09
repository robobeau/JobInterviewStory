
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
            var collision = Game.checkCollision(player, player.data('player')['direction']);

            if (collision == true && player.data('player')['allowMove']) {
                if (collision.obstacle.is('.npc')) {
                    collision.obstacle.npc('talk', collision.obstacle.data('npc')['dialogue']);
                }
            }
        }

        switch (true) {

            // W, Up Arrow

            case ((Game.pressedKeys[87] || Game.pressedKeys[38]) && player.data('player')['allowMove']) :
                player.data('player')['direction'] = 'u';

                var collision = Game.checkCollision(player, player.data('player')['direction']);

                playerSprite.removeClass('down left right').addClass('walking up');

                if (collision == false && player.data('player')['allowMove']) {
                    player.data('player')['allowMove'] = false;

                    Game.moveObject(player, player.data('player')['direction'], function () {
                        player.data('player')['allowMove'] = true;
                    });

                    if (collision.doorway || collision.stairs) {
                        if (collision.stairs) {
                            player.player('useStairs', collision.direction);
                        }

                        Stage.init(collision.area);
                    }
                } else {
                    playerSprite.removeClass('walking');
                }

                break;

            // S, Down Arrow

            case ((Game.pressedKeys[83] || Game.pressedKeys[40]) && player.data('player')['allowMove']) :
                player.data('player')['direction'] = 'd';

                var collision = Game.checkCollision(player, player.data('player')['direction']);

                playerSprite.removeClass('left right up').addClass('walking down');

                if (collision == false && player.data('player')['allowMove']) {
                    player.data('player')['allowMove'] = false;

                    Game.moveObject(player, player.data('player')['direction'], function () {
                        player.data('player')['allowMove'] = true;
                    });

                    if (collision.doorway || collision.stairs) {
                        if (collision.stairs) {
                            player.player('useStairs', collision.direction);
                        }

                        Stage.init(collision.area);
                    }
                } else {
                    playerSprite.removeClass('walking');
                }

                break;

            // A, Left Arrow

            case ((Game.pressedKeys[65] || Game.pressedKeys[37]) && player.data('player')['allowMove']) :
                player.data('player')['direction'] = 'l';

                var collision = Game.checkCollision(player, player.data('player')['direction']);

                playerSprite.removeClass('down right up').addClass('walking left');

                if (collision == false && player.data('player')['allowMove']) {
                    player.data('player')['allowMove'] = false;

                    Game.moveObject(player, player.data('player')['direction'], function () {
                        player.data('player')['allowMove'] = true;
                    });

                    if (collision.doorway || collision.stairs) {
                        if (collision.stairs) {
                            player.player('useStairs', collision.direction);
                        }

                        Stage.init(collision.area);
                    }
                } else {
                    playerSprite.removeClass('walking');
                }

                break;

            // D, Right Arrow

            case ((Game.pressedKeys[68] || Game.pressedKeys[39]) && player.data('player')['allowMove']) :
                player.data('player')['direction'] = 'r';

                var collision = Game.checkCollision(player, player.data('player')['direction']);

                console.log(obstacle);

                playerSprite.removeClass('down left up').addClass('walking right');

                if (collision == false && player.data('player')['allowMove']) {
                    var obstacle = Game.checkObstacles(player, player.data('player')['direction']);

                    player.data('player')['allowMove'] = false;

                    if (obstacle) {
                        console.log('Derp');
                        // if (obstacle.is('.stairs')) {
                        //     player.player('useStairs', collision.direction);
                        // }

                        Stage.init(obstacle.attr('data-area'));
                    }

                    Game.moveObject(player, player.data('player')['direction'], function () {
                        player.data('player')['allowMove'] = true;
                    });
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
    checkCollision: function (object, direction) {
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

        if (Stage.collisionMap[objectCoord.y + offsetT]) {
            return Stage.collisionMap[objectCoord.y + offsetT][objectCoord.x + offsetL];
        }

        return;

        // var
        //     objectPos   = object.position(),
        //     obstacle    = Game.areaObstacles.filter(function () {
        //         var obstaclePos = $(this).position();

        //         return obstaclePos.left == objectPos.left + offsetL && obstaclePos.top == (objectPos.top + offsetT);
        //     });

        // if (obstacle.length === 0) {
        //     return {
        //         state: false,
        //     };
        // }

        // var
        //     objectL         = objectPos.left + offsetL,
        //     objectT         = objectPos.top + offsetT,
        //     objectH         = object.height(),
        //     objectW         = object.width(),
        //     obstaclePos     = obstacle.position(),
        //     obstacleL       = obstaclePos.left,
        //     obstacleT       = obstaclePos.top,
        //     obstacleH       = obstacle.height(),
        //     obstacleW       = obstacle.width(),
        //     hWidths         = (objectW / 2) + (obstacleW / 2),
        //     hHeights        = (objectH / 2) + (obstacleH / 2),
        //     vX              = (objectL + (objectW / 2)) - (obstacleL + (obstacleW / 2)),
        //     vY              = (objectT + (objectH / 2)) - (obstacleT + (obstacleH / 2));

        // if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights && obstacle.is(':not(.doorway, .stairs)')) {
            // var
            //     dir = '',
            //     oX  = hWidths - Math.abs(vX),
            //     oY  = hHeights - Math.abs(vY);

            // if (oX >= oY) {
            //     if (vY > 0) {
            //         dir = 't';
            //     } else {
            //         dir = 'b';
            //     }
            // } else {
            //     if (vX > 0) {
            //         dir = 'l';
            //     } else {
            //         dir = 'r';
            //     }
            // }

            // return {
            //     state       : true,
            //     obstacle    : obstacle
            // };
        // }

        // return {
        //     state       : false,
        //     obstacle    : obstacle,
        //     doorway     : obstacle.is('.doorway'),
        //     area        : obstacle.is('.doorway, .stairs') ? obstacle.attr('data-area') : '',
        //     stairs      : obstacle.is('.stairs'),
        //     direction   : obstacle.is('.stairs') ? obstacle.attr('data-direction') : ''
        // };
    },

    /**
     *
     */
    checkObstacles: function (object, direction) {
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

        if (Stage.objectMap[objectCoord.y + offsetT]) {
            return Stage.objectMap[objectCoord.y + offsetT][objectCoord.x + offsetL];
        }

        return;
    },

    /**
     *
     */
    getCoordinates: function (object) {
        var objectPos = object.position();

        return {
            'x': objectPos.left / Game.gridCellSize + 1,
            'y': objectPos.top / Game.gridCellSize + 1
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
