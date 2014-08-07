
/** MODAL WINDOWS *********************************************************************************/

function Modals () {
    this.activeModal    = '';
    this.allowPress     = true;
    this.cancelTyping   = false;
    this.continueIcon   = '<div class="icon continue"></div>'
    this.id             = 0;
    this.npc            = '';
    this.typing         = false;

    /**
     *
     */
    this.checkButtons = function () {
        var modal = $.modals.activeModal;

        if (modal.length == 0 || modal.html() == '') {
            return;
        }

        var
            activeElement   = $(document.activeElement),
            dialogue        = modal.data('modal')['dialogue'];

        if (!$.modals.allowPress) {
            return;
        }

        // Shift
        if ($.game.pressedKeys[16]) {

        }

        // Spacebar, Enter
        if ($.game.pressedKeys[13] || $.game.pressedKeys[32]) {
            $.modals.allowPress = false;

            switch (true) {
                case (activeElement.is('li')) :
                    var choice = Dialogue[dialogue].choices[activeElement.index()];

                    if (choice.action) {
                        choice.action();
                    }

                    if (choice.goTo) {
                        return modal.modal('populate', choice.goTo, Dialogue[choice.goTo]);
                    }

                    break;

                default :
                    if ($.modals.typing) {
                        $.modals.cancelTyping = true;

                        return;
                    }

                    if (Dialogue[dialogue].goTo) {
                        modal.modal('populate', Dialogue[dialogue].goTo, Dialogue[Dialogue[dialogue].goTo]);

                        break;
                    } else if (Dialogue[dialogue].end) {
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
                $.modals.allowPress = false;

                switch (true) {
                    case (activeElement.is('li')) :
                        activeElement.prev('li').trigger('focus');

                        break;
                }

                break;

            // S, Down Arrow
            case (($.game.pressedKeys[83] || $.game.pressedKeys[40])) :
                $.modals.allowPress = false;

                switch (true) {
                    case (activeElement.is('li')) :
                        activeElement.next('li').trigger('focus');

                        break;
                }

                break;

            // A, Left Arrow
            case (($.game.pressedKeys[65] || $.game.pressedKeys[37])) :
                $.modals.allowPress = false;

                break;

            // D, Right Arrow
            case (($.game.pressedKeys[68] || $.game.pressedKeys[39])) :
                $.modals.allowPress = false;

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

        $.modals.allowPress = false;

        while (id.length < (3 - ((modalCounter + '')).length + 1)) {
            id = '0' + id;
        }

        id = 'm' + id;

        $('#modals').append('<div id="' + id + '" class="modal" tabindex="0"></div>');

        modal = $('#' + id);

        modal.data('modal', new Modals());
        modal.data('modal')['id']   = id;

        if (npc) {
            modal.data('modal')['npc']  = npc ? npc : '';
        }

        modal.css({
            left    : position.left + 'px',
            top     : position.top + 'px'
        });

        modal.animate({
            height  : size.height + 'px',
            width   : size.width + 'px'
        }, 180, function () {
            modal.modal('populate', dialogue);

            $.modals.activeModal = modal;
        });
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
            modal.remove();

            if (npc) {
                npc.npc('destroyEmote');

                $.npc.talking = false;
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
            emote   = Dialogue[dialogue].emote,
            modal   = $(this),
            npc     = $.game.activeNPC,
            type    = Dialogue[dialogue].type;

        if (npc && emote) {
            npc.npc('emote', emote);
        }

        modal.data('modal')['dialogue'] = dialogue;

        switch (type) {

            // Choice
            case 'choice':
                var choices = '<ul class="choice">';

                $.each(Dialogue[dialogue].choices, function (index, value) {
                    choices += '<li tabindex="0">' + value.label + '</li>'
                });

                choices += '</ul>';

                modal.html(choices).find('li:first').trigger('focus');

                break;

            // Dialogue
            case 'dialogue':
                var
                    counter     = 0,
                    interval    = setInterval(function () {
                        if ($.modals.cancelTyping) {
                            modal.append(Dialogue[dialogue].text.substr(counter, Dialogue[dialogue].text.length));

                            $.modals.cancelTyping   = false;
                            $.modals.typing         = false;

                            modal.append($.modals.continueIcon);

                            clearInterval(interval);

                            return;
                        };

                        modal.append(Dialogue[dialogue].text.charAt(counter));

                        $.sounds.fx.bip.play();

                        counter++;

                        if (counter >= Dialogue[dialogue].text.length) {
                            $.modals.typing = false;

                            modal.append($.modals.continueIcon);

                            clearInterval(interval);

                            return;
                        }
                    }, 50);

                $.modals.typing = true;

                modal.html('');

                modal.trigger('focus');

                if (Dialogue[dialogue].action) {
                    Dialogue[dialogue].action();
                }

                break;

            // Notification
            case 'notification':
                modal.append(Dialogue[dialogue].text);

                setTimeout(function () {
                    modal.modal('destroy', null);
                }, 5000);

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

$.modals = new Modals();
