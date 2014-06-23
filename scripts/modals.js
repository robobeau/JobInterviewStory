
/** MODAL WINDOWS **/

function Modal () {
    this.backgroundColor    = '#303030';
    this.id                 = 0;
    this.initiator          = '';

    /**
     *
     */
    this.create = function (id, size, position, content, initiator) {
        var modal = $('#' + id);

        if (modal.length === 0) {
            $('#modals').append('<div id="' + id + '" class="modal"><div class="modal-content" tabindex="0"></div></div>');
        } else {
            return false;
        }

        modal = $('#' + id);

        modal.data('modal', new Modal());

        modal.data('modal')['id']          = id;
        modal.data('modal')['initiator']   = initiator ? initiator : '';

        modal.css({
            backgroundColor: modal.data('modal')['backgroundColor']
        });

        modal.animate({
            height  : size.height + 'px',
            left    : position.left + 'px',
            top     : position.top + 'px',
            width   : size.width + 'px',
            zIndex  : position.zIndex
        }, 200, function () {
            $(this).modal('populate', content);
        });
    },

    /**
     *
     */
    this.destroy = function (id, focus) {
        var
            modal = $('#' + id),
            modalContent = modal.find('.modal-content');

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

        if (Game.activeNPC) {
            Game.activeNPC.npc('destroyEmote');
        }

        focus.trigger('focus');
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
            modalContent    = modal.find('.modal-content'),
            npc             = Game.activeNPC,
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
                                return modal.modal('populate', Dialogues[choice.goTo]);
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
                                modal.modal('populate', Dialogues[content.goTo]);

                                return;
                            } else if (content.end) {
                                modal.modal('destroy', modal.data('modal')['id'], $('#player'));

                                if (modal.data('modal')['initiator']) {
                                    modal.data('modal')['initiator'].data('npc')['wanderPause'] = false;
                                }

                                return;
                            }

                            break;
                    }
                });

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
