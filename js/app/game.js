
game = {
    states: {
        activeNPC: ''
    },

    engine: {
        friction        : 0.4,
        pressedKeys     : [],
        player          :
        {
            accX        : 0,
            accY        : 0,
            speed       : 2
        },
        scrollAmount    : 1,

        /**
         *
         */
        colCheck: function (shapeA, shapeB) {
            var
                vX          = (parseFloat(shapeA.css('left')) + (shapeA.width() / 2)) - (parseFloat(shapeB.css('left')) + (shapeB.width() / 2)),
                vY          = (parseFloat(shapeA.css('top')) + (shapeA.height() / 2)) - (parseFloat(shapeB.css('top')) + (shapeB.height() / 2)),
                hWidths     = (shapeA.width() / 2) + (shapeB.width() / 2),
                hHeights    = (shapeA.height() / 2) + (shapeB.height() / 2),
                colDir      = null;

            if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
                var
                    oX = hWidths - Math.abs(vX),
                    oY = hHeights - Math.abs(vY);

                if (oX >= oY) {
                    if (vY > 0) {
                        colDir = 'u';

                        $('#player').css('top', function (index, value) {
                            return parseFloat(value) + oY - 0.1;
                        });
                    } else {
                        colDir = 'd';

                        $('#player').css('top', function (index, value) {
                            return parseFloat(value) - oY + 0.1;
                        });
                    }
                } else {
                    if (vX > 0) {
                        colDir = 'l';

                        $(shapeA).css('left', function (index, value) {
                            return parseFloat(value) + oX - 0.1;
                        });
                    } else {
                        colDir = 'r';

                        $(shapeA).css('left', function (index, value) {
                            return parseFloat(value) - oX + 0.1;
                        });
                    }
                }
            }

            return game.engine.player.dir = colDir;
        },

        /**
         *
         */
        update: function () {
            game.engine.friction      = 0.4;
            game.engine.player.moving = false;

            if (game.engine.pressedKeys[16]) { // Shift
                game.engine.friction = 0.6;
            }

            switch (true) {
                case (game.engine.pressedKeys[65] || game.engine.pressedKeys[37]) : // A, Left
                    game.engine.player.moving = true;

                    $('#player').removeClass('down right up').addClass('left');

                    if (game.engine.player.accX < game.engine.player.speed) {
                        game.engine.player.accX--;
                    }

                    break;

                case (game.engine.pressedKeys[87] || game.engine.pressedKeys[38]) : // W, Up
                    game.engine.player.moving = true;

                    $('#player').removeClass('down left right').addClass('up');

                    if (game.engine.player.accY < game.engine.player.speed) {
                        game.engine.player.accY--;
                    }

                    break;

                case (game.engine.pressedKeys[68] || game.engine.pressedKeys[39]) : // D, Right
                    game.engine.player.moving = true;

                    $('#player').removeClass('down left up').addClass('right');

                    if (game.engine.player.accX > -game.engine.player.speed) {
                        game.engine.player.accX++;
                    }

                    break;

                case (game.engine.pressedKeys[83] || game.engine.pressedKeys[40]) : // S, Down
                    game.engine.player.moving = true;

                    $('#player').removeClass('left right up').addClass('down');

                    if (game.engine.player.accY > -game.engine.player.speed) {
                        game.engine.player.accY++;
                    }

                    break;
            }

            game.engine.player.accX *= game.engine.friction;
            game.engine.player.accY *= game.engine.friction;

            for (var i = 0; i < $('.obstacle').length; i++) {
                var
                    obstacle    = $('.obstacle').eq(i),
                    dir         = game.engine.colCheck($('#player'), obstacle);

                if (dir == 'l' || dir == 'r') {
                    game.engine.player.acclX = 0;
                } else if (dir == 'u' || dir == 'd') {
                    game.engine.player.acclY = 0;
                }

                if (game.engine.pressedKeys[13] || game.engine.pressedKeys[32]) { // Spacebar
                    if (dir && obstacle.is('.npc')) {
                        obstacle.npc('talk', obstacle.data('npc')['dialogue']);
                    }
                }
            }

            if (game.engine.player.moving) {
                $('#player').addClass('walking');
            } else {
                $('#player').removeClass('walking');
            }

            // Update player's X axis
            $('#player').css('left', function (index, value) {
                return parseFloat(value) + game.engine.player.accX;
            });

            // Update player's Y axis
            $('#player').css('top', function (index, value) {
                return parseFloat(value) + game.engine.player.accY;
            });

            // game.cameraCheck();
        },
    },

    player: {

    },

    start: function () {
        setInterval(function () {
            game.engine.update();
        }, 0);

        $('#sprites').append('<div id="player" tabindex="0" style="left: 50px; top: 300px;"></div>');

        $('#player').trigger('focus');

        $.npc.create(
            'npc0',
            {
                height  : 42,
                width   : 32
            },
            {
                left    : 100,
                top     : 250
            },
            'd0'
        );

        $.npc.create(
            'npc1',
            {
                height  : 42,
                width   : 32
            },
            {
                left    : 175,
                top     : 200
            },
            'd1'
        );
    }
};

/** PLAYER **/

$(document).on('keydown', '#player', function (event) {
    var key = event.keyCode || event.which;

    game.engine.pressedKeys[event.keyCode] = true;
});

$(document).on('keyup', '#player', function (event) {
    var key = event.keyCode || event.which;

    game.engine.pressedKeys[event.keyCode] = false;
});

/** NPCS **/

function NPC () {
    this.dialogue   = 'd0';
    this.id         = 0;

    /**
     *
     */
    this.create = function (id, size, position, dialogue) {
        var npc = $('#' + id);

        if (npc.length === 0) {
            $('#sprites').append('<div id="' + id + '" class="npc obstacle"></div>');
        } else {
            return false;
        }

        npc = $('#' + id);

        npc.data('npc', new NPC());

        npc.data('npc')['id']       = id;
        npc.data('npc')['dialogue'] = dialogue;

        npc.css({
            left    : position.left + 'px',
            top     : position.top + 'px',
            zIndex  : position.zIndex
        });
    },

    /**
     *
     */
    this.destroyEmote = function () {
        var npc = $(this);

        npc.find('.emote').animate({
            opacity : 0,
            top     : '-48px'
        }, 100, function () {
            $(this).remove();
        });
    }

    /**
     *
     */
    this.emote = function (emotion) {
        var npc     = $(this),
            emote   = npc.find('.emote');

        if (emote.length === 0) {
            npc.html('<div class="emote ' + emotion + '" style="opacity: 0; top: -48px"></div>');

            npc.find('.emote').animate({
                opacity : 1,
                top     : '-32px'
            }, 100);
        } else {
            npc.html('<div class="emote ' + emotion + '"></div>');
        }
    },

    /**
     *
     */
    this.move = function (direction, steps) {
        var npc     = $(this),
            speed   = 2;

        switch (direction) {
            case 'd':
                var top = parseFloat(npc.css('top'));

                npc.animate({
                    top: top + (steps * speed)
                }, 200);

                break;

            case 'l':
                var left = parseFloat(npc.css('left'));

                npc.animate({
                    left: left - (steps * speed)
                }, 200);

                break;

            case 'r':
                var left = parseFloat(npc.css('left'));

                npc.animate({
                    left: left + (steps * speed)
                }, 200);

                break;

            case 'u':
                var top = parseFloat(npc.css('top'));

                npc.animate({
                    top: top - (steps * speed)
                }, 200);

                break;
        }
    },

    /**
     *
     */
    this.talk = function (dialogue) {
        var npc = $(this);

        game.states.activeNPC = npc;

        $.window.create(
            'dialogue',
            {
                height  : 110,
                width   : 640
            },
            {
                left    : 20,
                top     : 20
            },
            dialogues[dialogue]
        );
    }
}

$.fn.npc = function (option) {
    var
        element     = $(this[0]),
        otherArgs   = Array.prototype.slice.call(arguments, 1);

    if (typeof option !== 'undefined' && otherArgs.length > 0) {
        return element.data('npc')[option].apply(this[0], [].concat(otherArgs));
    } else if (typeof option !== 'undefined') {
        return element.data('npc')[option].call (this[0]);
    } else {
        return element.data('npc');
    }
}

$.npc = new NPC();

/** START **/

$(document).on('ready', function () {
    game.start();
});

/** WINDOWS **/

function Window () {
    this.backgroundColor = '#303030',
    this.id              = 0,

    /**
     *
     */
    this.create = function (id, size, position, content) {
        var modal = $('#' + id);

        if (modal.length === 0) {
            $('#windows').append('<div id="' + id + '" class="window"><div class="window-content" tabindex="0"></div></div>');
        } else {
            return false;
        }

        modal = $('#' + id);

        modal.data('window', new Window());

        modal.data('window')['id'] = id;

        modal.css({
            backgroundColor: modal.data('window')['backgroundColor']
        });

        modal.animate({
            height  : size.height + 'px',
            left    : position.left + 'px',
            top     : position.top + 'px',
            width   : size.width + 'px',
            zIndex  : position.zIndex
        }, 200, function () {
            $(this).window('populate', content);
        });
    },

    /**
     *
     */
    this.destroy = function (id, focus) {
        var
            modal = $('#' + id),
            modalContent = modal.find('.window-content');

        modalContent.html('');

        modal.animate({
            height  : '30px',
            left    : '0px',
            top     : '0px',
            width   : '30px',
            zIndex  : '0'
        }, 200, function () {
            $(this).remove();
        });

        if (game.states.activeNPC) {
            game.states.activeNPC.npc('destroyEmote');
        }

        focus.trigger('focus');
    },

    /**
     *
     */
    this.option = function (option, value) {
        var
            element = $(this),
            data    = element.data('window');

        if (typeof value === 'undefined') {
            return data[option];
        } else {
            data[option] = value;

            switch (option) {
                case 'backgroundColor':
                    element.css({
                        backgroundColor: value
                    });

                    break;
            }
        }
    },

    /**
     *
     */
    this.populate = function (content) {
        var
            emote           = content.emote,
            modal           = $(this),
            modalContent    = modal.find('.window-content'),
            npc             = game.states.activeNPC,
            type            = content.type;

        if (npc && emote) {
            npc.npc('emote', emote);
        }

        switch (type) {
            case 'choice':
                var choices = '<ul class="choice">';

                $.each(content.choices, function (index, value) {
                    choices += '<li tabindex="0">' + value.label + '</li>'
                });

                choices += '</ul>';

                modalContent.html(choices).find('li:first').trigger('focus');

                //
                modalContent.off().on('keyup', function (event) {
                    var choice  = $(document.activeElement),
                        key     = event.keyCode || event.which;

                    switch (key) {
                        case 13:
                        case 32: // Enter, Spacebar
                            var choice = content.choices[choice.index()];

                            if (choice.action) {
                                choice.action();
                            }

                            if (choice.goTo) {
                                return modal.window('populate', dialogues[choice.goTo]);
                            }

                            break;

                        case 38:
                        case 87: // Up Arrow
                            choice.prev('li').trigger('focus');

                            break;

                        case 40:
                        case 83: // Down Arrow
                            choice.next('li').trigger('focus');

                            break;
                    }
                });

                break;

            case 'dialogue':
                modalContent.html(content.text).trigger('focus');

                if (content.action) {
                    content.action();
                }

                //
                modalContent.off().on('keyup', function (event) {
                    var key = event.keyCode || event.which;

                    switch (key) {
                        case 13:
                        case 32: // Enter, Spacebar
                            if (content.goTo) {
                                return modal.window('populate', dialogues[content.goTo]);
                            } else if (content.end) {
                                return modal.window('destroy', modal.data('window')['id'], $('#player'));
                            }

                            break;
                    }
                });

                break;
        }
    }
}

$.fn.window = function (option) {
    var
        element     = $(this[0]),
        otherArgs   = Array.prototype.slice.call(arguments, 1);

    if (typeof option !== 'undefined' && otherArgs.length > 0) {
        return element.data('window')[option].apply(this[0], [].concat(otherArgs));
    }

    return element.data('window');
}

$.window = new Window();
