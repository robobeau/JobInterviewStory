
/** MODAL WINDOWS **/

function Modal () {
    this.id     = 0;
    this.npc    = '';

    /**
     *
     */
    this.create = function (id, size, position, content, npc) {
        var modal = $('#' + id);

        if (modal.length > 0) {
            return;
        }

        $('#modals').append('<div id="' + id + '" class="modal" tabindex="0"></div>');

        modal = $('#' + id);

        modal.data('modal', new Modal());
        modal.data('modal')['id']          = id;
        modal.data('modal')['npc']   = npc ? npc : '';

        modal.css({
            left    : position.left + 'px',
            top     : position.top + 'px'
        });

        modal.animate({
            height  : size.height + 'px',
            width   : size.width + 'px',
            zIndex  : position.zIndex
        }, 200, function () {
            $(this).modal('populate', id, content);
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
        }, 200, function () {
            $(this).remove();
        });

        if (npc) {
            npc.npc('destroyEmote');

            npc.data('npc')['talking'] = false;
        }

        if (focus) {
            focus.trigger('focus');
        }
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
    this.populate = function (id, content) {
        var
            emote   = content.emote,
            modal   = $(this),
            npc     = Game.activeNPC,
            type    = content.type;

        if (npc && emote) {
            npc.npc('emote', emote);
        }

        modal.attr('id', id);
        modal.data('modal')['id'] = id;

        switch (type) {
            case 'choice':
                var choices = '<ul class="choice">';

                $.each(content.choices, function (index, value) {
                    choices += '<li tabindex="0">' + value.label + '</li>'
                });

                choices += '</ul>';

                modal.html(choices).find('li:first').trigger('focus');

                //
                modal.off().on('keyup', function (event) {
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
                                return modal.modal('populate', choice.goTo, Dialogues[choice.goTo]);
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
                modal.html(content.text).trigger('focus');

                if (content.action) {
                    content.action();
                }

                //
                modal.off().on('keyup', function (event) {
                    var key = event.keyCode || event.which;

                    switch (key) {
                        case 13:
                        case 32: // Enter, Spacebar
                            if (content.goTo) {
                                modal.modal('populate', content.goTo, Dialogues[content.goTo]);

                                return;
                            } else if (content.end) {
                                modal.modal('destroy', $('#player'));

                                if (modal.data('modal')['npc']) {
                                    modal.data('modal')['npc'].data('npc')['wanderPause'] = false;
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
