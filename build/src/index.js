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
        this.history = [];
        this.historyPos = -1;
        if (!config['data-ps'])
            config['data-ps'] = defaultDataPS;
        if (!config.customCommands)
            config.customCommands = [];
        const terminalDOM = document.createElement('div');
        terminalDOM.style.backgroundColor = 'black';
        terminalDOM.style.color = '#ddd';
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
        this.terminalWrapperHtmlElement = document.createElement('div');
        this.terminalWrapperHtmlElement.style.padding = '15px 15px 0 15px';
        this.terminalWrapperHtmlElement.style.height = '100%';
        this.terminalWrapperHtmlElement.style.overflow = 'auto';
        this.terminalWrapperHtmlElement.style.fontFamily =
            'Courier New,Courier,monospace';
        this.terminalWrapperHtmlElement.style.fontSize = '1rem';
        if ((_e = config === null || config === void 0 ? void 0 : config.window) === null || _e === void 0 ? void 0 : _e.show) {
            this.terminalWrapperHtmlElement.style.borderStyle = 'solid';
            this.terminalWrapperHtmlElement.style.borderColor =
                ((_f = config === null || config === void 0 ? void 0 : config.window) === null || _f === void 0 ? void 0 : _f.bgColor) || '#198754';
            this.terminalWrapperHtmlElement.style.borderWidth = '4px';
            this.terminalWrapperHtmlElement.style.borderTop = '0';
        }
        terminalDOM.appendChild(this.terminalWrapperHtmlElement);
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
        this.inputHtmlElement.addEventListener('keydown', event => {
            switch (event.key) {
                case 'Enter':
                    event.preventDefault();
                    this.exec(this.inputHtmlElement.textContent);
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    if (!this.config.history)
                        return;
                    if (this.history[this.historyPos - 1]) {
                        this.historyPos--;
                        this.inputHtmlElement.textContent =
                            this.history[this.historyPos].info.fullText;
                    }
                    else {
                        if (this.historyPos === 0) {
                            this.historyPos = -1;
                            this.inputHtmlElement.textContent = '';
                        }
                    }
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (!this.config.history)
                        return;
                    if (this.history[this.historyPos + 1]) {
                        this.historyPos++;
                        this.inputHtmlElement.textContent =
                            this.history[this.historyPos].info.fullText;
                    }
                    break;
            }
        });
        const terminalStyle = document.createElement('style');
        let css = '.prompt .input::before { vertical-align: middle; content: attr(data-ps); padding-right: 10px; }';
        css +=
            '.prompt .input::after { visibility : visible; content: "|"; margin-left:-0.15em;}';
        css += '.prompt .input.blink::after { visibility : hidden; }';
        css += '.content ul.select li.selected { list-style : circle !important; }';
        const head = document.head || document.getElementsByTagName('head')[0];
        this.headerChildCSS = head.appendChild(terminalStyle);
        terminalStyle.setAttribute('type', 'text/css');
        terminalStyle.appendChild(document.createTextNode(css));
        this.terminalWrapperHtmlElement.appendChild(this.contentHtmlElement);
        this.terminalWrapperHtmlElement.appendChild(prompt);
        if (config.nativeCommands)
            this.createNativeCommands();
        config.elementHtml.appendChild(terminalDOM);
    }
    getAllCommands() {
        return [...this.nativeCommands, ...this.config.customCommands];
    }
    createNativeCommands() {
        this.nativeCommands = [
            {
                name: 'clear',
                help: 'Cleans the screen leaving a new command prompt ready.',
                method: (cmd) => {
                    cmd.options.terminalElements.content.innerHTML = '';
                },
            },
            {
                name: 'help',
                help: 'Displays a list of useful information. Usage: <ul>' +
                    "<li><i>help command-name</i> to show <i>command-name</i>'s help.</li>" +
                    '<li><i>help -a</i> or <i>help --all</i> to display all help.</li></ul>',
                method: (cmd) => {
                    var _a;
                    if (!((_a = cmd.options.info.args) === null || _a === void 0 ? void 0 : _a.length)) {
                        cmd.echo('Use "help [comand name]" to display specific info about a command.');
                        cmd.echo('Available commands are:');
                        cmd.echoList(this.getAllCommands().map((cmd) => `${cmd.name}`), true);
                    }
                    else {
                        if (['--all', '-a'].includes(cmd.options.info.args[0])) {
                            cmd.echoList(this.getAllCommands().map((cmd) => `<b>${cmd.name}</b> - ${cmd.help}`));
                        }
                        else {
                            const findCommad = this.getAllCommands().find(c => c.name === cmd.options.info.args[0]);
                            if (findCommad) {
                                cmd.echo(`<b>${findCommad.name}</b> - ${findCommad.help}`);
                            }
                            else {
                                cmd.echo(`Command <i>${cmd.options.info.args[0]}</i> not found.`);
                            }
                        }
                    }
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
            const arrayText = text === null || text === void 0 ? void 0 : text.split(' ');
            arrayText === null || arrayText === void 0 ? void 0 : arrayText.shift();
            const command = this.getAllCommands().find(c => c.name === (text === null || text === void 0 ? void 0 : text.split(' ')[0]));
            const cmd = new CMD({
                terminalElements: {
                    commandContainer,
                    content: this.contentHtmlElement,
                    input: this.inputHtmlElement,
                    terminalWrapper: this.terminalWrapperHtmlElement,
                },
                info: {
                    args: arrayText || [],
                    cmdFound: !!command,
                    fullText: text || '',
                    textArgs: (arrayText === null || arrayText === void 0 ? void 0 : arrayText.join(' ')) || '',
                    startDate: new Date(),
                },
            }, this.config);
            cmd.echo(text || '', true);
            if (command) {
                try {
                    yield command.method(cmd);
                }
                catch (err) {
                    console.error('Error exec ' + text, err);
                }
            }
            if (!command) {
                cmd.echo('Command not found', false);
            }
            cmd.options.info.endDate = new Date();
            if (this.config.history) {
                this.addToHistory(cmd.options);
            }
            this.inputHtmlElement.style.display = 'block';
            this.inputHtmlElement.focus();
            this.terminalWrapperHtmlElement.scrollTop =
                this.terminalWrapperHtmlElement.scrollHeight;
        });
    }
    addToHistory(cmdOtions) {
        if (!this.config.history)
            return;
        this.history.push(cmdOtions);
        this.historyPos = -1;
    }
    getHistory() {
        return this.history;
    }
    getHTMLElements() {
        return {
            content: this.contentHtmlElement,
            input: this.inputHtmlElement,
            terminalWrapper: this.terminalWrapperHtmlElement,
        };
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
        var _a;
        const divEcho = document.createElement('div');
        divEcho.classList.add('echo');
        if (ps)
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
        (_a = this.options.terminalElements.commandContainer) === null || _a === void 0 ? void 0 : _a.appendChild(divEcho);
    }
    echoList(textArray, inline = false) {
        var _a;
        const divEcho = document.createElement('div');
        divEcho.classList.add('echo');
        divEcho.style.lineHeight = '2em';
        const ulEchoList = document.createElement('ul');
        ulEchoList.style.padding = '0';
        ulEchoList.style.margin = '0';
        textArray.forEach(tLi => {
            const li = document.createElement('li');
            if (inline)
                li.style.display = 'inline-block';
            li.style.padding = '10px';
            li.style.listStyle = 'none';
            li.innerHTML += tLi;
            ulEchoList.appendChild(li);
        });
        divEcho.appendChild(ulEchoList);
        (_a = this.options.terminalElements.commandContainer) === null || _a === void 0 ? void 0 : _a.appendChild(divEcho);
    }
    log() {
        console.log(this);
    }
    select(obj, echoResult = false) {
        if (!obj)
            return Promise.reject();
        return new Promise(resolve => {
            var _a;
            let currentValue = 0;
            const divSelect = document.createElement('ul');
            divSelect.classList.add('select');
            divSelect.tabIndex = 0;
            divSelect.style.margin = '0';
            divSelect.style.lineHeight = '2em';
            divSelect.style.outline = 'none';
            obj.forEach((o, index) => {
                const selectLi = document.createElement('li');
                selectLi.style.listStyle = 'none';
                if (index === currentValue) {
                    selectLi.classList.add('selected');
                }
                selectLi.innerHTML = o.label
                    ? o.label
                    : o.toString();
                divSelect.appendChild(selectLi);
            });
            const setFocus = () => {
                setTimeout(() => divSelect.focus(), 0);
            };
            setFocus();
            this.options.terminalElements.terminalWrapper.addEventListener('click', setFocus);
            divSelect.addEventListener('keydown', event => {
                switch (event.key) {
                    case 'Enter':
                        event.preventDefault();
                        this.options.terminalElements.terminalWrapper.removeEventListener('click', setFocus);
                        divSelect.remove();
                        if (echoResult) {
                            this.echo(obj[currentValue].label
                                ? obj[currentValue].label
                                : obj[currentValue].toString());
                        }
                        resolve(obj[currentValue]);
                        break;
                    case 'ArrowDown':
                        event.preventDefault();
                        if (currentValue < obj.length - 1) {
                            divSelect
                                .getElementsByTagName('li')[currentValue].classList.remove('selected');
                            currentValue++;
                            divSelect
                                .getElementsByTagName('li')[currentValue].classList.add('selected');
                        }
                        break;
                    case 'ArrowUp':
                        event.preventDefault();
                        if (currentValue > 0) {
                            divSelect
                                .getElementsByTagName('li')[currentValue].classList.remove('selected');
                            currentValue--;
                            divSelect
                                .getElementsByTagName('li')[currentValue].classList.add('selected');
                        }
                        break;
                }
            });
            (_a = this.options.terminalElements.commandContainer) === null || _a === void 0 ? void 0 : _a.appendChild(divSelect);
        });
    }
}
//# sourceMappingURL=index.js.map