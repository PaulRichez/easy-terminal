import { ICMD } from './models/CMD.model';
import { ITerminalConfig } from './models/TerminalConfig.model';
import { ITerminalElements } from './models/terminalElements.model';
export declare class EasyTerminal {
    private config;
    private headerChildCSS;
    private contentHtmlElement;
    private inputHtmlElement;
    private nativeCommands;
    private history;
    private historyPos;
    constructor(config: ITerminalConfig);
    private createNativeCommands;
    destroy(): void;
    exec(text: string | null): Promise<void>;
    private addToHistory;
    getHistory(): ICMD[];
    getHTMLElement(): ITerminalElements;
}
export declare class CMD {
    readonly options: ICMD;
    readonly terminalConfig: ITerminalConfig;
    constructor(options: ICMD, terminalConfig: ITerminalConfig);
    echo(text: string, ps?: boolean): void;
    log(): void;
}
