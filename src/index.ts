import {ITerminalConfig} from './models/TerminalConfig.model';
const defaultDataPS = '$';
export class EasyTerminal {
  private headerChildCSS: HTMLStyleElement;
  constructor(config: ITerminalConfig) {
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
    if (config?.window?.show) {
      full.style.borderStyle = 'solid';
      full.style.borderColor = config?.window?.bgColor || '#198754';
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
      if (!(event?.target as any)?.textContent) {
        input.classList.remove('blink');
        input.style.color = 'transparent';
        input.style.textShadow = '0 0 0 #ddd';
      } else {
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
    let css =
      '.prompt .input::before { vertical-align: middle; content: attr(data-ps); padding-right: 10px; }';
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

  public destroy(): void {
    const head = document.head || document.getElementsByTagName('head')[0];
    head.removeChild(this.headerChildCSS);
  }
}
