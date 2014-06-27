
Game = {
    activeNPC   : '',
    directions  : [
        'u',
        'd',
        'l',
        'r'
    ],
    fps         : 60,
    pressedKeys : [],

    /**
     *
     */
    calculateZindex: function (object) {
        var objectCollision = object.is('#player, .npc') ? object.find('#player-collision, .npc-collision') : object;

        object.css({
            zIndex: objectCollision.offset().top
        });
    },

    /**
     *
     */
    collisionCheck: function (object, direction) {
        for (var i = 0; i < $('.collision, .npc').length; i++) {
            var
                objectCollision     = object.is('#player, .npc') ? object.find('#player-collision, .npc-collision') : object,
                obstacle            = $('#player, .npc, .collision').not(object).eq(i),
                obstacleCollision   = obstacle.is('.npc') ? obstacle.find('.npc-collision') : obstacle,
                objectH             = objectCollision.outerHeight(),
                objectL             = parseFloat(object.css('left')),
                objectT             = parseFloat(object.css('top')) + parseFloat(objectCollision.css('top')),
                objectW             = object.outerWidth(),
                obstacleH           = obstacleCollision.outerHeight(),
                obstacleL           = parseFloat(obstacle.css('left')),
                obstacleT           = obstacle.is('.npc') ? parseFloat(obstacle.css('top')) + parseFloat(obstacleCollision.css('top')) : parseFloat(obstacleCollision.css('top')),
                obstacleW           = obstacle.outerWidth();

            switch (direction) {
                case 'u':
                    objectT -= 32;

                    break;

                case 'd':
                    objectT += 32;

                    break;

                case 'l':
                    objectL -= 32;

                    break;

                case 'r':
                    objectL += 32;

                    break;
            }

            var
                vX          = (objectL + (objectW / 2)) - (obstacleL + (obstacleW / 2)),
                vY          = (objectT + (objectH / 2)) - (obstacleT + (obstacleH / 2)),
                hWidths     = (objectW / 2) + (obstacleW / 2),
                hHeights    = (objectH / 2) + (obstacleH / 2);

            if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
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

                return {
                    state       : true,
                    obstacle    : obstacle
                };
            }
        }

        return {
            state       : false,
            obstacle    : null
        };
    },

    moveObject: function (object, direction, callback) {
        var
            animateOptions  = {},
            left            = parseFloat(object.css('left')),
            top             = parseFloat(object.css('top'));

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
            200,
            'linear',
            function () {
                Game.calculateZindex(object);

                if (callback) {
                    callback();
                }
            }
        );
    },

    player: {
        allowMoving : true,
        direction   : null
    },

    /**
     *
     */
    setStage: function (stage) {
        $.get('../json/'+ stage +'.json', function (data) {
            Stage.drawTiles(data.layers[0]);

            Stage.drawCollisions(data.layers[1]);

            Stage.drawObjects(data.layers[2]);
        });
    },

    /**
     *
     */
    start: function () {
        setInterval(function () {
            Game.update();
        }, 1000 / Game.fps);

        Game.setStage('a001');

        // $('#npc0').npc('wander');
        // $('#npc1').npc('wander');

        for (i = 0; i < $('#player, .npc, .object').length; i++) {
            Game.calculateZindex($('#player, .npc, .object').eq(i));
        }
    },

    /**
     *
     */
    update: function () {
        var
            player  = $('#player'),
            left    = parseFloat(player.css('left')),
            top     = parseFloat(player.css('top'));

        Game.player.speedMultiplier = 1;

        if (Game.pressedKeys[16]) { // Shift
            Game.player.speedMultiplier = 2;
        }

        if (Game.pressedKeys[13] || Game.pressedKeys[32]) { // Spacebar, Enter
            var collide = Game.collisionCheck(player, Game.player.direction);

            if (collide.state == true && !player.is(':animated')) {
                if (collide.obstacle.is('.npc')) {
                    collide.obstacle.npc('talk', collide.obstacle.data('npc')['dialogue']);
                }
            }
        }

        switch (true) {
            case ((Game.pressedKeys[87] || Game.pressedKeys[38]) && !player.is(':animated')) : // W, Up Arrow
                Game.player.direction = 'u';

                var collide = Game.collisionCheck(player, Game.player.direction);

                player.removeClass('down left right').addClass('walking up');

                if (collide.state == false && !player.is(':animated')) {
                    Game.moveObject(player, Game.player.direction);
                } else {
                    player.removeClass('walking');
                }

                break;

            case ((Game.pressedKeys[83] || Game.pressedKeys[40]) && !player.is(':animated')) : // S, Down Arrow
                Game.player.direction = 'd';

                var collide = Game.collisionCheck(player, Game.player.direction);

                player.removeClass('left right up').addClass('walking down');

                if (collide.state == false && !player.is(':animated')) {
                    Game.moveObject(player, Game.player.direction);
                } else {
                    player.removeClass('walking');
                }

                break;

            case ((Game.pressedKeys[65] || Game.pressedKeys[37]) && !player.is(':animated')) : // A, Left Arrow
                Game.player.direction = 'l';

                var collide = Game.collisionCheck(player, Game.player.direction);

                player.removeClass('down right up').addClass('walking left');

                if (collide.state == false && !player.is(':animated')) {
                    Game.moveObject(player, Game.player.direction);
                } else {
                    player.removeClass('walking');
                }

                break;

            case ((Game.pressedKeys[68] || Game.pressedKeys[39]) && !player.is(':animated')) : // D, Right Arrow
                Game.player.direction = 'r';

                var collide = Game.collisionCheck(player, Game.player.direction);

                player.removeClass('down left up').addClass('walking right');

                if (collide.state == false && !player.is(':animated')) {
                    Game.moveObject(player, Game.player.direction);
                } else {
                    player.removeClass('walking');
                }

                break;


            default:
                if (!player.is(':animated')) {
                    player.removeClass('walking');
                }

                break;
        }

        // Game.cameraCheck();
    }
};

/** PLAYER **/

$(document).on('keydown', '#player', function (event) {
    var key = event.keyCode || event.which;

    Game.pressedKeys[event.keyCode] = true;
});

$(document).on('keyup', '#player', function (event) {
    var key = event.keyCode || event.which;

    Game.pressedKeys[event.keyCode] = false;
});

/** START **/

$(document).on('ready', function () {
    Game.start();
});