import { ICMD } from './models/CMD.model';
import { ITerminalConfig } from './models/TerminalConfig.model';
export declare class EasyTerminal {
    private config;
    private headerChildCSS;
    private contentHtmlElement;
    private inputHtmlElement;
    private nativeCommands;
    constructor(config: ITerminalConfig);
    private createNativeCommands;
    destroy(): void;
    exec(text: string | null): Promise<void>;
}
export declare class CMD {
    options: ICMD;
    terminalConfig: ITerminalConfig;
    constructor(options: ICMD, terminalConfig: ITerminalConfig);
    echo(text: string, ps?: boolean): void;
}
