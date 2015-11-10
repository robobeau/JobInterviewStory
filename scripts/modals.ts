/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="dialogue.ts" />
/// <reference path="game.ts" />
/// <reference path="sounds.ts" />

interface IModal {
    allowPress: boolean;
    cancelTyping: boolean;
    continueIcon: JQuery;
    dialogue: any;
    id: number;
    modalInterval: number;
    modalTimeout: number;
    npc: JQuery;
    self: JQuery; // The modal's jQuery object reference
    type: string;
    typing: boolean;
}

interface IModalOptions {
    dialogue: any;
    npc?: JQuery;
    size: any;
    position?: any;
    type: any;
}

class Modals {
    public modalCounter: number = 0;

    constructor() {

    }

    public create(options: IModalOptions): void {
        var delay: number = 0;
        var id: string = String(this.modalCounter);
        var modal: JQuery;

        while (id.length < (3 - id.length + 1)) {
            id = '0' + id;
        }

        id = 'm' + id;

        modal = $('<div id="' + id + '" class="modal ' + options.type + '" tabindex="0"></div>');

        if (options.type === 'notification') {
            delay = 200;

            (<JQuery>$('.modal.notification')).not(modal).each((index, element) => {
                (<JQuery>$(element)).data('modal').destroy(null);
            });
        }

        setTimeout(() => {
            modal.data('modal', new Modal(modal));
            modal.data('modal').id = id;
            modal.data('modal').dialogue = options.dialogue;
            modal.data('modal').type = options.type;

            if (options.npc) {
                modal.data('modal').npc = options.npc;
            }

            stage.modalsDiv.append(modal);

            if (options.position) {
                modal.css({
                    left: options.position.left,
                    top: options.position.top
                });
            }

            modal.animate({
                height: options.size.height,
                width: options.size.width
            },
            200,
            () => {
                if (options.type !== 'notification') {
                    game.activeModal = modal;
                }

                modal.data('modal').populate();
            });
        }, delay);

        this.modalCounter++;
    }
}

class Modal implements IModal {
    public allowPress: boolean = true;
    public cancelTyping: boolean = false;
    public continueIcon: JQuery = $('<div class="icon continue"></div>');
    public dialogue: any;
    public id: number = 0;
    public modalInterval: number;
    public modalTimeout: number;
    public npc: JQuery;
    public self: JQuery;
    public type: string;
    public typing: boolean = false;

    constructor(modal) {
        this.self = modal;
    }

    public checkButtons(): void {
        if (!this.allowPress) {
            return;
        }

        var activeElement = $(document.activeElement);

        if (game.pressedKeys[13] || game.pressedKeys[32]) { // Spacebar, Enter
            this.allowPress = false;

            if (activeElement.is('li')) {
                var choice = this.dialogue.choices[activeElement.index()];

                if (typeof choice.action === 'function') {
                    choice.action();
                }

                if (choice.goTo) {
                    this.dialogue = dialogue[choice.goTo];
                    this.type = this.dialogue.choices ? 'choice' : 'dialogue';

                    this.populate();
                }
            } else {
                if (this.typing) {
                    this.cancelTyping = true;
                } else if (this.dialogue.goTo) {
                    this.dialogue = dialogue[this.dialogue.goTo];
                    this.type = this.dialogue.choices ? 'choice' : 'dialogue';

                    this.populate();
                } else {
                    this.destroy(game.activePlayer);
                }
            }
        }

        if ((game.pressedKeys[87] || game.pressedKeys[38])) { // W, Up Arrow
            this.allowPress = false;

            if (activeElement.is('li')) {
                activeElement.prev('li').trigger('focus');
            }
        } else if ((game.pressedKeys[83] || game.pressedKeys[40])) { // S, Down Arrow
            this.allowPress = false;

            if (activeElement.is('li')) {
                activeElement.next('li').trigger('focus');
            }
        }
    }

    public destroy(focus): void {
        this.self.html('');

        this.self.animate({
            height: 0,
            width: 0,
            zIndex: 0
        },
        200,
        () => {
            this.modalInterval && clearInterval(this.modalInterval);
            this.modalTimeout && clearTimeout(this.modalTimeout);

            if (this.type !== 'notification') {
                game.activeModal = undefined;

                if (this.npc) {
                    this.npc.data('npc').destroyEmote();

                    this.npc.data('npc').talking = false;
                    this.npc.data('npc').wanderPause = false;
                }

                if (game.activePlayer) {
                    game.activePlayer.data('player').allowMove = true;
                    game.activePlayer.data('player').talking = false;
                }
            }

            if (focus) {
                focus.trigger('focus');
            }

            this.self.remove();
        });
    }

    public populate(): void {
        if (game.activeNPC && this.dialogue.emote) {
            game.activeNPC.data('npc').emote(this.dialogue.emote);
        }

        switch (this.type) {
            case 'choice':
                var choices = '<ul class="choice">';

                $.each(this.dialogue.choices, (index, value) => {
                    choices += '<li tabindex="0">' + value.label + '</li>'
                });

                choices += '</ul>';

                this.self.html(choices)
                    .find('li:first').trigger('focus');

                break;
            case 'dialogue':
            case 'flavor':
                var counter = 0;
                var interval = setInterval(() => {
                    if (this.cancelTyping) {
                        this.cancelTyping = false;
                        this.typing = false;

                        this.self.append(this.dialogue.text.substr(counter, this.dialogue.text.length));
                        this.self.append(this.continueIcon);

                        clearInterval(interval);

                        return;
                    };

                    this.self.append(this.dialogue.text.charAt(counter));

                    sounds.fx.bip.play();

                    counter++;

                    if (counter >= this.dialogue.text.length) {
                        this.typing = false;

                        this.self.append(this.continueIcon);

                        clearInterval(interval);

                        return;
                    }
                }, 60);

                this.typing = true;

                this.self.html('');

                if (typeof this.dialogue.action === 'function') {
                    this.dialogue.action();
                }

                break;
            case 'notification':
                this.self.append(this.dialogue.text);

                this.modalTimeout = setTimeout(() => {
                    this.destroy(null);
                }, 10000);

                break;
        }
    }
}

var modals = new Modals();