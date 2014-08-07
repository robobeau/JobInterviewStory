
/** SOUNDS ****************************************************************************************/

function Sounds () {
    this.currentMusic   = '';
    this.fx             = {
        bip     : new Audio($.game.domain + '/sounds/bip.wav'),
        bump    : new Audio($.game.domain + '/sounds/bump.wav'),
        door    : new Audio($.game.domain + '/sounds/door.wav'),
        enter   : new Audio($.game.domain + '/sounds/enter.wav'),
        error   : new Audio($.game.domain + '/sounds/error.wav')
    }
    this.music          = {
        shadesOfRed : $.game.domain + '/sounds/Pokemon_Red_Version_Shades_of_Red_OC_ReMix.mp3'
    }

    this.changeMusic = function (newMusic) {
        if ($.sounds.currentMusic) {
            $.sounds.fade($.sounds.currentMusic, 0, function () {
                $.sounds.currentMusic.pause();
            });
        }

        $.game.loading = true;

        $.sounds.currentMusic = new Audio(newMusic);

        $.sounds.currentMusic.canplaythrough = $.sounds.playMusic();
    }

    this.fade = function (sound, volume, callback) {
        var
            offset  = 0.0001,
            steps   = Math.abs(sound.volume - volume) / 0.0001;

        if (sound.volume > volume) {
            offset = -0.0001;
        }

        for (var i = 1; i <= steps; i++) {
            sound.volume += offset;
        }

        if (callback) {
            callback();
        }
    }

    this.playMusic = function () {
        $.game.loading = false;

        $.sounds.currentMusic.loop = true;

        $.sounds.currentMusic.play();

        $.modals.create(
            {
                height  : 20,
                width   : 320
            },
            {
                left    : 20,
                top     : $(window).outerHeight() - 72
            },
            'm000'
        );
    }
}

$.fn.sounds = function (option) {
    var
        element     = $(this[0]),
        otherArgs   = Array.prototype.slice.call(arguments, 1);

    if (typeof option !== 'undefined' && otherArgs.length > 0) {
        return element.data('sounds')[option].apply(this[0], [].concat(otherArgs));
    } else if (typeof option !== 'undefined') {
        return element.data('sounds')[option].call (this[0]);
    } else {
        return element.data('sounds');
    }
}

$.sounds = new Sounds();
