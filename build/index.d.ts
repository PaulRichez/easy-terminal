import { ICMD } from './models/CMD.model';
import { ICMDSelect } from './models/CMDSelect.model';
import { ITerminalCommand } from './models/TerminalCommand.model';
import { ITerminalConfig } from './models/TerminalConfig.model';
import { ITerminalElements } from './models/terminalElements.model';
export declare class EasyTerminal {
    private config;
    private headerChildCSS;
    private contentHtmlElement;
    private terminalWrapperHtmlElement;
    private inputHtmlElement;
    private nativeCommands;
    private history;
    private historyPos;
    constructor(config: ITerminalConfig);
    getAllCommands(): ITerminalCommand[];
    private createNativeCommands;
    destroy(): void;
    exec(text: string | null): Promise<void>;
    private addToHistory;
    getHistory(): ICMD[];
    getHTMLElements(): ITerminalElements;
}
export declare class CMD {
    readonly options: ICMD;
    readonly terminalConfig: ITerminalConfig;
    constructor(options: ICMD, terminalConfig: ITerminalConfig);
    echo(text: string, ps?: boolean): void;
    echoList(textArray: string[], inline?: boolean): void;
    log(): void;
    select(obj: ICMDSelect[] | string[], echoResult?: boolean): Promise<unknown>;
}
