
/** NPCS **/

function NPC () {
    this.dialogue       = 'd0';
    this.id             = 0;
    this.wanderInterval = '';
    this.wanderPause    = false;

    /**
     *
     */
    this.create = function (id, size, position, dialogue) {
        var npc = $('#' + id);

        if (npc.length === 0) {
            $('#objects').append('<div id="' + id + '" class="npc"><div class="npc-collision"></div></div>');
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
            npc.append('<div class="emote ' + emotion + '" style="opacity: 0; top: -48px"></div>');

            npc.find('.emote').animate({
                opacity : 1,
                top     : '-32px'
            }, 100);
        } else {
            npc.find('.emote').replaceWith('<div class="emote ' + emotion + '"></div>');
        }
    },

    /**
     *
     */
    this.move = function (direction) {
        var npc = $(this);

        switch (direction) {
            case 'd':
                Game.moveObject(npc, direction);

                break;

            case 'l':
                Game.moveObject(npc, direction);

                break;

            case 'r':
                Game.moveObject(npc, direction);

                break;

            case 'u':
                Game.moveObject(npc, direction);

                break;
        }
    },

    /**
     *
     */
    this.talk = function (dialogue) {
        var npc = $(this);

        Game.activeNPC = npc;

        npc.data('npc')['wanderPause'] = true;

        $.modal.create(
            'dialogue',
            {
                height  : 80,
                width   : 720
            },
            {
                left    : ($(window).width() - (720 + 32)) / 2,
                top     : 20
            },
            Dialogues[dialogue],
            npc
        );
    },

    /**
     *
     */
    this.wander = function () {
        var npc = $(this);

        clearInterval(this.wanderInterval);

        this.wanderInterval = setInterval(function () {
            var direction = Game.directions[Math.floor(Math.random() * Game.directions.length)];

            if (Math.random() < 0.5 || npc.data('npc')['wanderPause'] === true) {
                return;
            }

            var collide = Game.collisionCheck(npc, direction);

            if (collide.state == false && !npc.is(':animated')) {
                Game.moveObject(npc, direction);
            } else {

            }
        }, 1000);
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
