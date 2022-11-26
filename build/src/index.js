var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const defaultDataPS = '$';
export class EasyTerminal {
    constructor(config) {
        var _a, _b, _c, _d, _e, _f;
        this.config = config;
        this.nativeCommands = [];
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
        full.style.overflow = 'auto';
        if ((_e = config === null || config === void 0 ? void 0 : config.window) === null || _e === void 0 ? void 0 : _e.show) {
            full.style.borderStyle = 'solid';
            full.style.borderColor = ((_f = config === null || config === void 0 ? void 0 : config.window) === null || _f === void 0 ? void 0 : _f.bgColor) || '#198754';
            full.style.borderWidth = '4px';
            full.style.borderTop = '0';
        }
        terminalDOM.appendChild(full);
        this.contentHtmlElement = document.createElement('div');
        this.contentHtmlElement.classList.add('content');
        this.contentHtmlElement.innerHTML = config.welcome || '';
        const prompt = document.createElement('div');
        prompt.classList.add('prompt');
        this.inputHtmlElement = document.createElement('div');
        this.inputHtmlElement.classList.add('input');
        this.inputHtmlElement.classList.add('blink');
        this.inputHtmlElement.style.outline = 'none';
        this.inputHtmlElement.style.width = '100%';
        this.inputHtmlElement.style.wordWrap = 'break-word';
        this.inputHtmlElement.style.whiteSpace = 'pre-wrap';
        this.inputHtmlElement.style.lineHeight = '2em';
        this.inputHtmlElement.style.color = 'transparent';
        this.inputHtmlElement.style.textShadow = '0 0 0 #ddd';
        this.inputHtmlElement.style.fontSize = '1rem';
        this.inputHtmlElement.contentEditable = 'true';
        this.inputHtmlElement.spellcheck = false;
        this.inputHtmlElement.setAttribute('data-ps', config['data-ps']);
        prompt.appendChild(this.inputHtmlElement);
        let inputFocused = false;
        this.inputHtmlElement.addEventListener('focusin', () => {
            inputFocused = true;
        });
        this.inputHtmlElement.addEventListener('focusout', () => {
            inputFocused = false;
            this.inputHtmlElement.classList.add('blink');
        });
        setInterval(() => {
            if (inputFocused && !this.inputHtmlElement.textContent) {
                this.inputHtmlElement.classList.toggle('blink');
            }
        }, 800);
        this.inputHtmlElement.addEventListener('input', event => {
            var _a;
            if (!((_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.textContent)) {
                this.inputHtmlElement.classList.remove('blink');
                this.inputHtmlElement.style.color = 'transparent';
                this.inputHtmlElement.style.textShadow = '0 0 0 #ddd';
            }
            else {
                this.inputHtmlElement.classList.add('blink');
                this.inputHtmlElement.style.textShadow = 'none';
                this.inputHtmlElement.style.color = '#ddd';
            }
        });
        terminalDOM.addEventListener('click', () => {
            this.inputHtmlElement.focus();
        });
        this.inputHtmlElement.addEventListener('keypress', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.exec(this.inputHtmlElement.textContent);
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
        full.appendChild(this.contentHtmlElement);
        full.appendChild(prompt);
        if (config.nativeCommands)
            this.createNativeCommands();
        config.elementHtml.appendChild(terminalDOM);
    }
    createNativeCommands() {
        this.nativeCommands = [
            {
                name: 'clear',
                method: (cmd) => {
                    cmd.options.terminalElement.content.innerHTML = '';
                },
            },
        ];
    }
    destroy() {
        const head = document.head || document.getElementsByTagName('head')[0];
        head.removeChild(this.headerChildCSS);
    }
    exec(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandContainer = document.createElement('div');
            this.contentHtmlElement.appendChild(commandContainer);
            this.inputHtmlElement.classList.remove('blink');
            this.inputHtmlElement.style.color = 'transparent';
            this.inputHtmlElement.style.textShadow = '0 0 0 #ddd';
            this.inputHtmlElement.textContent = '';
            this.inputHtmlElement.style.display = 'none';
            const cmd = new CMD({
                terminalElement: {
                    commandContainer,
                    content: this.contentHtmlElement,
                    input: this.inputHtmlElement,
                },
            }, this.config);
            cmd.echo(text || '', true);
            const command = this.nativeCommands.find(c => c.name === text);
            if (command) {
                try {
                    yield command.method(cmd);
                }
                catch (err) {
                    console.error('Error exec ' + text, err);
                }
            }
            if (!command) {
                cmd.echo('Command not found');
            }
            this.inputHtmlElement.style.display = 'block';
            this.contentHtmlElement.scrollTop =
                this.contentHtmlElement.scrollHeight + 10;
        });
    }
}
export class CMD {
    constructor(options, terminalConfig) {
        this.options = options;
        this.terminalConfig = terminalConfig;
        this.options = options;
        this.terminalConfig = terminalConfig;
    }
    echo(text, ps = false) {
        const divEcho = document.createElement('div');
        divEcho.classList.add('echo');
        divEcho.style.lineHeight = '2em';
        if (this.terminalConfig['data-ps'] && ps) {
            const spanPS = document.createElement('span');
            spanPS.innerHTML = this.terminalConfig['data-ps'];
            spanPS.style.paddingRight = '10px';
            divEcho.appendChild(spanPS);
        }
        const spanEcho = document.createElement('span');
        spanEcho.innerHTML = text;
        divEcho.appendChild(spanEcho);
        this.options.terminalElement.commandContainer.appendChild(divEcho);
    }
}
//# sourceMappingURL=index.js.map