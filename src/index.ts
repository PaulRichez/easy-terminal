import {ICMD} from './models/CMD.model';
import {ITerminalCommand} from './models/TerminalCommand.model';
import {ITerminalConfig} from './models/TerminalConfig.model';
import {ITerminalElements} from './models/terminalElements.model';
const defaultDataPS = '$';
export class EasyTerminal {
  private headerChildCSS: HTMLStyleElement;
  private contentHtmlElement: HTMLElement;
  private inputHtmlElement: HTMLElement;
  private nativeCommands: ITerminalCommand[] = [];
  private history: ICMD[] = [];
  private historyPos = -1;
  constructor(private config: ITerminalConfig) {
    if (!config['data-ps']) config['data-ps'] = defaultDataPS;

    const terminalDOM = document.createElement('div');
    terminalDOM.style.backgroundColor = 'black';
    terminalDOM.style.color = 'white';
    terminalDOM.style.textAlign = 'left';
    terminalDOM.style.height = '100%';
    terminalDOM.style.display = 'flex';
    terminalDOM.style.flexDirection = 'column';
    if (config?.window?.show) {
      const headerTerminal = document.createElement('div');
      headerTerminal.style.backgroundColor =
        config?.window?.bgColor || '#198754';
      headerTerminal.style.color = config?.window?.textColor || 'white';
      headerTerminal.style.padding = '7px';
      headerTerminal.style.fontWeight = 'bold';
      headerTerminal.innerHTML = config?.window?.title || 'EasyTerminal';
      terminalDOM.appendChild(headerTerminal);
    }

    const full = document.createElement('div');
    full.style.padding = '15px 15px 0 15px';
    full.style.height = '100%';
    full.style.overflow = 'auto';
    if (config?.window?.show) {
      full.style.borderStyle = 'solid';
      full.style.borderColor = config?.window?.bgColor || '#198754';
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
      if (!(event?.target as any)?.textContent) {
        this.inputHtmlElement.classList.remove('blink');
        this.inputHtmlElement.style.color = 'transparent';
        this.inputHtmlElement.style.textShadow = '0 0 0 #ddd';
      } else {
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
          if (!this.config.history) return;
          if (this.history[this.historyPos - 1]) {
            this.historyPos--;
            this.inputHtmlElement.textContent =
              this.history[this.historyPos].info.fullText;
          } else {
            if (this.historyPos === 0) {
              this.historyPos = -1;
              this.inputHtmlElement.textContent = '';
            }
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (!this.config.history) return;
          if (this.history[this.historyPos + 1]) {
            this.historyPos++;
            this.inputHtmlElement.textContent =
              this.history[this.historyPos].info.fullText;
          }
          break;
      }
    });

    const terminalStyle = document.createElement('style');
    let css =
      '.prompt .input::before { vertical-align: middle; content: attr(data-ps); padding-right: 10px; }';
    css +=
      '.prompt .input::after { visibility : visible; content: "|"; margin-left:-0.15em;}';
    css += '.prompt .input.blink::after { visibility : hidden; }';
    const head = document.head || document.getElementsByTagName('head')[0];
    this.headerChildCSS = head.appendChild(terminalStyle);
    terminalStyle.setAttribute('type', 'text/css');
    terminalStyle.appendChild(document.createTextNode(css));

    full.appendChild(this.contentHtmlElement);
    full.appendChild(prompt);
    if (config.nativeCommands) this.createNativeCommands();
    config.elementHtml.appendChild(terminalDOM);
  }

  private createNativeCommands() {
    this.nativeCommands = [
      {
        name: 'clear',
        method: (cmd: CMD) => {
          cmd.options.terminalElements.content.innerHTML = '';
        },
      },
    ];
  }

  public destroy(): void {
    const head = document.head || document.getElementsByTagName('head')[0];
    head.removeChild(this.headerChildCSS);
  }

  public async exec(text: string | null) {
    const commandContainer = document.createElement('div');
    this.contentHtmlElement.appendChild(commandContainer);
    this.inputHtmlElement.classList.remove('blink');
    this.inputHtmlElement.style.color = 'transparent';
    this.inputHtmlElement.style.textShadow = '0 0 0 #ddd';
    this.inputHtmlElement.textContent = '';
    this.inputHtmlElement.style.display = 'none';
    const arrayText = text?.split(' ');
    arrayText?.shift();
    const command = this.nativeCommands.find(
      c => c.name === text?.split(' ')[0]
    );
    const cmd = new CMD(
      {
        terminalElements: {
          commandContainer,
          content: this.contentHtmlElement,
          input: this.inputHtmlElement,
        },
        info: {
          args: arrayText || null,
          cmdFound: !!command,
          fullText: text || '',
          textArgs: arrayText?.join(' ') || '',
          startDate: new Date(),
        },
      },
      this.config
    );
    cmd.echo(text || '');
    if (command) {
      try {
        await command.method(cmd);
      } catch (err) {
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
    this.contentHtmlElement.scrollTop =
      this.contentHtmlElement.scrollHeight + 10;
  }

  private addToHistory(cmdOtions: ICMD) {
    if (!this.config.history) return;
    this.history.push(cmdOtions);
    this.historyPos = -1;
  }

  public getHistory(): ICMD[] {
    return this.history;
  }

  public getHTMLElement(): ITerminalElements {
    return {
      content: this.contentHtmlElement,
      input: this.inputHtmlElement,
    };
  }
}

export class CMD {
  constructor(
    public readonly options: ICMD,
    public readonly terminalConfig: ITerminalConfig
  ) {
    this.options = options;
    this.terminalConfig = terminalConfig;
  }
  public echo(text: string, ps = true) {
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
    this.options.terminalElements.commandContainer?.appendChild(divEcho);
  }

  public log() {
    console.log(this);
  }
}
