
/** DIALOGUE **************************************************************************************/

Dialogue = {
    'd000': {
        type        : 'dialogue',
        text        : 'Hello, world!',
        emote       : 'talkHappy',
        end         : true
    },

    'd001': {
        type        : 'dialogue',
        text        : 'Do you want to go to lunch? I\'m hungry...',
        emote       : 'question',
        goTo        : 'c000'
    },

    'c000': {
        type    : 'choice',
        emote   : 'think',
        choices : [
            {
                label       : 'Yes',
                goTo        : 'd002'
            },

            {
                label       : 'No',
                goTo        : 'd003'
            }
        ]
    },

    'd002': {
        type        : 'dialogue',
        text        : 'Alright!',
        emote       : 'happiness',
        end         : true
    },

    'd003': {
        type        : 'dialogue',
        text        : 'Awwwww!',
        emote       : 'sadness',
        end         : true
    }
}
