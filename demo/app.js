/* eslint-disable prettier/prettier */
// eslint-disable-next-line node/no-unsupported-features/es-syntax, node/no-unpublished-import
const EasyTerminal = require('easy-terminal');
// eslint-disable-next-line no-undef
const terminalElement = window.document.getElementById('terminal');
const objTest = [{ label: 'l1', value: 'l1' }, { label: 'l2', value: 'l2' }]
const stringsTest = ['1', '2']
new EasyTerminal({
    elementHtml: terminalElement,
    window: { show: true, title: 'EasyTerminal' },
    nativeCommands: true,
    welcome: 'Welcome to EasyTerminal',
    history: true,
    noEmptyCommand: true,
    customCommands: [
        {
            name: 'test',
            help: 'test command',
            method: async function (cmd) {
                return await cmd.select(objTest, true)
            }
        },
        {
            name: 'test2',
            help: 'test2 command',
            method: async function (cmd) {
                return await cmd.select(stringsTest, false)
            }
        },
        {
            name: 'askAge',
            help: 'ask age to user',
            method: async function (cmd) {
                const age = await cmd.ask('age ?', true);
                cmd.echo('Age: ' + age);
            }
        }
    ]
});
