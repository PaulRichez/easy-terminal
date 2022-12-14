import { ITerminalCommand } from './TerminalCommand.model';
export interface ITerminalConfig {
    window?: {
        show?: boolean;
        title?: string;
        bgColor?: string;
        textColor?: string;
    };
    welcome?: string;
    elementHtml: HTMLElement;
    'data-ps'?: string;
    history?: boolean;
    noEmptyCommand?: boolean;
    nativeCommands: boolean;
    customCommands: ITerminalCommand[];
}
