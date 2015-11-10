var dialogue = {
    'd200': {
        text: 'Hello, world!',
        emote: 'talkHappy'
    },
    'd201': {
        text: 'Do you want to go to lunch? I\'m hungry...',
        emote: 'question',
        goTo: 'c000'
    },
    'c000': {
        emote: 'think',
        choices: [
            {
                label: 'Yes',
                goTo: 'd202'
            },
            {
                label: 'No',
                goTo: 'd203'
            }
        ]
    },
    'd202': {
        text: 'Alright!',
        emote: 'happiness'
    },
    'd203': {
        text: 'Awwwww!',
        emote: 'sadness'
    }
}