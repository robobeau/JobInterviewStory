/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="game.ts" />
/// <reference path="stage.ts" />

class Sounds {
    public currentMusic: any;
    public currentMusicId: string;
    public domain: string = location.protocol + '//' + location.host;
    public fx: any = {
        bip: new Audio(this.domain + '/sounds/bip.wav'),
        bump: new Audio(this.domain + '/sounds/bump.wav'),
        door: new Audio(this.domain + '/sounds/door.wav'),
        enter: new Audio(this.domain + '/sounds/enter.wav'),
        error: new Audio(this.domain + '/sounds/error.wav')
    };
    public music: any = {
        shadesOfRed: this.domain + '/sounds/Pokemon_Red_Version_Shades_of_Red_OC_ReMix.mp3',
        wetDreams: this.domain + '/sounds/Pokemon_Blue_Version_Wet_Dreams_OC_ReMix.mp3'
    };

    constructor() {

    }

    public changeMusic(newMusic: any): void {
        if (this.currentMusic) {
            this.fade(this.currentMusic, 0, () => {
                this.currentMusic.pause();
            });
        }

        game.loading = true;

        this.currentMusic = new Audio(newMusic);

        this.currentMusic.canplaythrough = this.playMusic();
    }

    public fade(sound: any, volume: number, callback?: any): void {
        var offset: number = 0.0001;
        var steps: number = Math.abs(sound.volume - volume) / 0.0001;

        if (sound.volume > volume) {
            offset = -0.0001;
        }

        for (var i: number = 1; i <= steps; i++) {
            sound.volume += offset;
        }

        if (callback) {
            callback();
        }
    }

    public playMusic(): void {
        game.loading = false;

        this.currentMusic.loop = true;

        this.currentMusic.play();

        modals.create(
            {
                height: 16,
                width: '25%'
            },
            {
                left: 20 + 3, // The 3 is half the border-image-outset value
                top: (<JQuery>$(window)).height() - 68 - 3 // The 3 is half the border-image-outset value
            },
            music[this.currentMusicId],
            null
        );
    }
}

var sounds = new Sounds();