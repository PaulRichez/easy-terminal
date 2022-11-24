const defaultDataPS = '$';
export class EasyTerminal {
    constructor(config) {
        var _a, _b, _c, _d, _e, _f;
        if (!config['data-ps'])
            config['data-ps'] = defaultDataPS;
        const terminalDOM = document.createElement('div');
        terminalDOM.style.backgroundColor = 'black';
        terminalDOM.style.color = 'white';
        terminalDOM.style.textAlign = 'left';
        terminalDOM.style.height = '100%';
        terminalDOM.style.display = 'flex';
        terminalDOM.style.flexDirection = 'column';
        if ((_a = config === null || config === void 0 ? void 0 : config.window) === null || _a === void 0 ? void 0 : _a.show) {
            const headerTerminal = document.createElement('div');
            headerTerminal.style.backgroundColor =
                ((_b = config === null || config === void 0 ? void 0 : config.window) === null || _b === void 0 ? void 0 : _b.bgColor) || '#198754';
            headerTerminal.style.color = ((_c = config === null || config === void 0 ? void 0 : config.window) === null || _c === void 0 ? void 0 : _c.textColor) || 'white';
            headerTerminal.style.padding = '7px';
            headerTerminal.style.fontWeight = 'bold';
            headerTerminal.innerHTML = ((_d = config === null || config === void 0 ? void 0 : config.window) === null || _d === void 0 ? void 0 : _d.title) || 'EasyTerminal';
            terminalDOM.appendChild(headerTerminal);
        }
        const full = document.createElement('div');
        full.style.padding = '15px 15px 0 15px';
        full.style.height = '100%';
        if ((_e = config === null || config === void 0 ? void 0 : config.window) === null || _e === void 0 ? void 0 : _e.show) {
            full.style.borderStyle = 'solid';
            full.style.borderColor = ((_f = config === null || config === void 0 ? void 0 : config.window) === null || _f === void 0 ? void 0 : _f.bgColor) || '#198754';
            full.style.borderWidth = '4px';
        }
        terminalDOM.appendChild(full);
        const content = document.createElement('div');
        content.classList.add('content');
        content.innerHTML = config.welcome || '';
        const prompt = document.createElement('div');
        prompt.classList.add('prompt');
        const input = document.createElement('div');
        input.classList.add('input');
        input.classList.add('blink');
        input.style.outline = 'none';
        input.style.width = '100%';
        input.style.wordWrap = 'break-word';
        input.style.whiteSpace = 'pre-wrap';
        input.style.lineHeight = '2em';
        input.style.color = 'transparent';
        input.style.textShadow = '0 0 0 #ddd';
        input.style.fontSize = '1rem';
        input.contentEditable = 'true';
        input.spellcheck = false;
        input.setAttribute('data-ps', config['data-ps']);
        prompt.appendChild(input);
        let inputFocused = false;
        input.addEventListener('focusin', () => {
            inputFocused = true;
        });
        input.addEventListener('focusout', () => {
            inputFocused = false;
            input.classList.add('blink');
        });
        setInterval(() => {
            if (inputFocused && !input.textContent) {
                input.classList.toggle('blink');
            }
        }, 800);
        input.addEventListener('input', event => {
            var _a;
            if (!((_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.textContent)) {
                input.classList.remove('blink');
                input.style.color = 'transparent';
                input.style.textShadow = '0 0 0 #ddd';
            }
            else {
                input.classList.add('blink');
                input.style.textShadow = 'none';
                input.style.color = '#ddd';
            }
        });
        terminalDOM.addEventListener('click', () => {
            input.focus();
        });
        input.addEventListener('keypress', event => {
            // If the user presses the "Enter" key on the keyboard
            if (event.key === 'Enter') {
                // Cancel the default action, if needed
                event.preventDefault();
                // this.enterAction()
            }
        });
        const terminalStyle = document.createElement('style');
        let css = '.prompt .input::before { vertical-align: middle; content: attr(data-ps); padding-right: 10px; }';
        css +=
            '.prompt .input::after { visibility : visible; content: "|"; margin-left:-0.15em;}';
        css += '.prompt .input.blink::after { visibility : hidden; }';
        const head = document.head || document.getElementsByTagName('head')[0];
        this.headerChildCSS = head.appendChild(terminalStyle);
        terminalStyle.setAttribute('type', 'text/css');
        terminalStyle.appendChild(document.createTextNode(css));
        full.appendChild(content);
        full.appendChild(prompt);
        config.elementHtml.appendChild(terminalDOM);
    }
    destroy() {
        const head = document.head || document.getElementsByTagName('head')[0];
        head.removeChild(this.headerChildCSS);
    }
}
//# sourceMappingURL=index.js.map