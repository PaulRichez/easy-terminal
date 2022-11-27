/* eslint-disable prettier/prettier */
export interface ITerminalCommand {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  method: any;
  help: string;
}
