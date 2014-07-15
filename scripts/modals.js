
/** MODAL WINDOWS **/

function Modal () {
    this.activeModal    = '';
    this.allowPress     = true;
    this.id             = 0;
    this.npc            = '';

    /**
     *
     */
    this.checkButtons = function () {
        var activeElement   = $(document.activeElement),
            allowPress      = $.modal.allowPress,
            modal           = $.modal.activeModal,
            dialogue        = modal.data('modal')['dialogue'];

        if (modal.html() == '' || !allowPress) {
            return;
        }

        // Shift

        if ($.game.pressedKeys[16]) {

        }

        // Spacebar, Enter

        if ($.game.pressedKeys[13] || $.game.pressedKeys[32]) {
            $.modal.allowPress = false;

            switch (true) {
                case (activeElement.is('li')) :
                    var choice = Dialogues[dialogue].choices[activeElement.index()];

                    if (choice.action) {
                        choice.action();
                    }

                    if (choice.goTo) {
                        return modal.modal('populate', choice.goTo, Dialogues[choice.goTo]);
                    }

                    break;

                default :
                    if (Dialogues[dialogue].goTo) {
                        modal.modal('populate', Dialogues[dialogue].goTo, Dialogues[Dialogues[dialogue].goTo]);

                        break;
                    } else if (Dialogues[dialogue].end) {
                        modal.modal('destroy', $('#player'));

                        if (modal.data('modal')['npc']) {
                            modal.data('modal')['npc'].data('npc')['wanderPause'] = false;
                        }

                        break;
                    }

                    break;
            }
        }

        switch (true) {

            // W, Up Arrow

            case (($.game.pressedKeys[87] || $.game.pressedKeys[38])) :
                $.modal.allowPress = false;

                switch (true) {
                    case (activeElement.is('li')) :
                        activeElement.prev('li').trigger('focus');

                        break;
                }

                break;

            // S, Down Arrow

            case (($.game.pressedKeys[83] || $.game.pressedKeys[40])) :
                $.modal.allowPress = false;

                switch (true) {
                    case (activeElement.is('li')) :
                        activeElement.next('li').trigger('focus');

                        break;
                }

                break;

            // A, Left Arrow

            case (($.game.pressedKeys[65] || $.game.pressedKeys[37])) :
                $.modal.allowPress = false;

                break;

            // D, Right Arrow

            case (($.game.pressedKeys[68] || $.game.pressedKeys[39])) :
                $.modal.allowPress = false;

                break;

            default:

                break;
        }
    }

    /**
     *
     */
    this.create = function (size, position, dialogue, npc) {
        var
            modalCounter    = $('.modal').length,
            modal           = '',
            id              = modalCounter + '';

        while (id.length < (3 - ((modalCounter + '')).length + 1)) {
            id = '0' + id;
        }

        id = 'm' + id;

        $('#modals').append('<div id="' + id + '" class="modal" tabindex="0"></div>');

        modal = $('#' + id);

        modal.data('modal', new Modal());
        modal.data('modal')['id']   = id;
        modal.data('modal')['npc']  = npc ? npc : '';

        modal.css({
            left    : position.left + 'px',
            top     : position.top + 'px'
        });

        modal.animate({
            height  : size.height + 'px',
            width   : size.width + 'px'
        }, 180, function () {
            $(this).modal('populate', dialogue);
        });

        $.modal.activeModal = modal;
    },

    /**
     *
     */
    this.destroy = function (focus) {
        var
            modal   = $(this),
            npc     = modal.data('modal')['npc'];

        modal.html('');

        modal.animate({
            height  : 0,
            width   : 0,
            zIndex  : 0
        }, 180, function () {
            $(this).remove();

            if (npc) {
                npc.npc('destroyEmote');

                npc.data('npc')['talking'] = false;
            }

            if (focus) {
                focus.trigger('focus');
            }
        });
    },

    /**
     *
     */
    this.option = function (option, value) {
        var
            element = $(this),
            data    = element.data('modal');

        if (typeof value === 'undefined') {
            return data[option];
        } else {
            data[option] = value;

            switch (option) {

            }
        }
    },

    /**
     *
     */
    this.populate = function (dialogue) {
        var
            emote   = Dialogues[dialogue].emote,
            modal   = $(this),
            npc     = $.game.activeNPC,
            type    = Dialogues[dialogue].type;

        if (npc && emote) {
            npc.npc('emote', emote);
        }

        modal.data('modal')['dialogue'] = dialogue;

        switch (type) {
            case 'choice':
                var choices = '<ul class="choice">';

                $.each(Dialogues[dialogue].choices, function (index, value) {
                    choices += '<li tabindex="0">' + value.label + '</li>'
                });

                choices += '</ul>';

                modal.html(choices).find('li:first').trigger('focus');

                break;

            case 'dialogue':
                modal.html(Dialogues[dialogue].text).trigger('focus');

                if (Dialogues[dialogue].action) {
                    Dialogues[dialogue].action();
                }

                break;
        }
    }
}

$.fn.modal = function (option) {
    var
        element     = $(this[0]),
        otherArgs   = Array.prototype.slice.call(arguments, 1);

    if (typeof option !== 'undefined' && otherArgs.length > 0) {
        return element.data('modal')[option].apply(this[0], [].concat(otherArgs));
    }

    return element.data('modal');
}

$.modal = new Modal();
