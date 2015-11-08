/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="game.ts" />
/// <reference path="script.ts" />
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
    typing: boolean;
}

class Modals {
    public modalCounter: number = 0;

    constructor() {

    }

    public create(size, position, dialogue, npc): void {
        var delay: number = 0;
        var id: string = String(this.modalCounter);
        var modal: JQuery;

        while (id.length < (3 - id.length + 1)) {
            id = '0' + id;
        }

        id = 'm' + id;

        modal = $('<div id="' + id + '" class="modal ' + dialogue.type + '" tabindex="0"></div>');

        if (dialogue.type === 'notification') {
            delay = 200;

            (<JQuery>$('.modal.notification')).not(modal).each((index, element) => {
                (<JQuery>$(element)).data('modal').destroy(null);
            });
        }

        setTimeout(() => {
            modal.data('modal', new Modal(modal));
            modal.data('modal').allowPress = false;
            modal.data('modal').id = id;

            if (npc) {
                modal.data('modal').npc = npc;
            }

            stage.modalsDiv.append(modal);

            if (dialogue.type !== 'notification') {
                game.activeModal = modal;
            }

            modal.css({
                left: position.left,
                top: position.top
            });

            modal.animate({
                height: size.height,
                width: size.width
            },
            200,
            () => {
                modal.data('modal').populate(dialogue);
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
    public typing: boolean = false;

    constructor(modal) {
        this.self = modal;
    }

    public checkButtons(): void {
        if (!this.allowPress) {
            return;
        }

        var activeElement = $(document.activeElement);

        if (game.pressedKeys[16]) { // Shift
            // Modify stuff...?
        }

        if (game.pressedKeys[13] || game.pressedKeys[32]) { // Spacebar, Enter
            this.allowPress = false;

            if (activeElement.is('li')) {
                var choice = this.dialogue.choices[activeElement.index()];

                if (typeof choice.action === 'function') {
                    choice.action();
                }

                if (choice.goTo) {
                    return this.populate(dialogue[choice.goTo]);
                }
            } else {
                if (this.typing) {
                    this.cancelTyping = true;
                } else if (this.dialogue.goTo) {
                    this.populate(dialogue[this.dialogue.goTo]);
                } else if (this.dialogue.end) {
                    this.destroy(game.activePlayer);

                    if (this.npc) {
                        this.npc.data('npc').wanderPause = false;
                    }
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
            game.activeModal = undefined;

            this.modalInterval && clearInterval(this.modalInterval);
            this.modalTimeout && clearTimeout(this.modalTimeout);

            if (this.npc) {
                this.npc.data('npc').destroyEmote();

                this.npc.data('npc').talking = false;
            }

            this.self.remove();

            if (focus) {
                focus.trigger('focus');
            }

            if (game.activePlayer) {
                game.activePlayer.data('player').allowMove = true;
            }
        });
    }

    public populate(dialogue): void {
        if (game.activeNPC && dialogue.emote) {
            game.activeNPC.data('npc').emote(dialogue.emote);
        }

        this.dialogue = dialogue;

        switch (dialogue.type) {
            case 'choice':
                var choices = '<ul class="choice">';

                $.each(dialogue.choices, (index, value) => {
                    choices += '<li tabindex="0">' + value.label + '</li>'
                });

                choices += '</ul>';

                this.self.html(choices)
                    .find('li:first').trigger('focus');

                break;
            case 'dialogue':
                var counter = 0;
                var interval = setInterval(() => {
                    if (this.cancelTyping) {
                        this.self.append(dialogue.text.substr(counter, dialogue.text.length));

                        this.cancelTyping = false;
                        this.typing = false;

                        this.self.append(this.continueIcon);

                        clearInterval(interval);

                        return;
                    };

                    this.self.append(dialogue.text.charAt(counter));

                    sounds.fx.bip.play();

                    counter++;

                    if (counter >= dialogue.text.length) {
                        this.typing = false;

                        this.self.append(this.continueIcon);

                        clearInterval(interval);

                        return;
                    }
                }, 60);

                this.typing = true;

                this.self.html('');

                if (typeof dialogue.action === 'function') {
                    dialogue.action();
                }

                break;
            case 'notification':
                this.self.append(dialogue.text);

                this.modalTimeout = setTimeout(() => {
                    this.destroy(null);
                }, 10000);

                break;
        }
    }
}

var modals = new Modals();