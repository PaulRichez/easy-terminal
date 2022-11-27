import { ITerminalElements } from './terminalElements.model';
export interface ICMD {
    terminalElements: ITerminalElements;
    info: {
        cmdFound: boolean;
        args: string[];
        fullText: string;
        textArgs: string;
        startDate: Date;
        endDate?: Date;
    };
}
