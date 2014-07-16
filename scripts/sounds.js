
/** SOUNDS ****************************************************************************************/

function Sounds () {
    this.fx = {
        bump        : new Audio('../sounds/bump.wav'),
        door        : new Audio('../sounds/door.wav'),
        enter       : new Audio('../sounds/enter.wav')
    }

    this.music = {
        fieldTheme  : new Audio('../sounds/field-theme.mp3'),
        townTheme   : new Audio('../sounds/town-theme.mp3')
    }

    this.currentMusic = '';

    this.changeMusic = function (newMusic) {
        if ($.sounds.currentMusic) {
            $.sounds.fade($.sounds.currentMusic, 0, function () {
                $.sounds.currentMusic.pause();
            });
        }

        $.sounds.currentMusic = newMusic;

        $.sounds.currentMusic.currentTime = 0;
        $.sounds.currentMusic.play();

        $.sounds.fade($.sounds.currentMusic, 1);
    }

    this.fade = function (sound, volume, callback) {
        var offset  = 0.0001,
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
