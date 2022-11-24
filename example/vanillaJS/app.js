/* eslint-disable prettier/prettier */
// eslint-disable-next-line node/no-unsupported-features/es-syntax
import { EasyTerminal } from '../../build/src/index.js';
// eslint-disable-next-line no-undef
const terminalElement = window.document.getElementById('terminal');

new EasyTerminal({
    elementHtml: terminalElement,
    window: { show: true, title: 'EasyTerminal' }
});
