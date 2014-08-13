
/** SOUNDS ****************************************************************************************/

Sounds = {
    currentMusic   : '',
    currentMusicId : '',
    fx             : {
        bip     : new Audio(Game.domain + '/sounds/bip.wav'),
        bump    : new Audio(Game.domain + '/sounds/bump.wav'),
        door    : new Audio(Game.domain + '/sounds/door.wav'),
        enter   : new Audio(Game.domain + '/sounds/enter.wav'),
        error   : new Audio(Game.domain + '/sounds/error.wav')
    },
    music          : {
        shadesOfRed : Game.domain + '/sounds/Pokemon_Red_Version_Shades_of_Red_OC_ReMix.mp3',
        wetDreams   : Game.domain + '/sounds/Pokemon_Blue_Version_Wet_Dreams_OC_ReMix.mp3'
    },

    changeMusic : function (newMusic) {
        if (Sounds.currentMusic) {
            Sounds.fade(Sounds.currentMusic, 0, function () {
                Sounds.currentMusic.pause();
            });
        }

        Game.loading = true;

        Sounds.currentMusic   = new Audio(newMusic);

        Sounds.currentMusic.canplaythrough = Sounds.playMusic();
    },

    fade : function (sound, volume, callback) {
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
    },

    playMusic : function () {
        Game.loading = false;

        Sounds.currentMusic.loop = true;

        Sounds.currentMusic.play();

        $.modals.create(
            {
                height  : 16,
                width   : '25%'
            },
            {
                left    : 20 + 3, // The 3 is half the border-image-outset value
                top     : $(window).height() - 68 - 3 // The 3 is half the border-image-outset value
            },
            Dialogue[Sounds.currentMusicId]
        );
    }
}
