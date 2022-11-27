/* eslint-disable prettier/prettier */
// eslint-disable-next-line node/no-unsupported-features/es-syntax
import { EasyTerminal } from '../../build/src/index.js';
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
    customCommands: [
        {
            name: 'test',
            help: 'test command',
            method: async function (cmd) {
                return await cmd.select(objTest, true)
            }
        },
        {
            name: 'testS',
            help: 'test command',
            method: async function (cmd) {
                return await cmd.select(stringsTest, false)
            }
        }
    ]
});
