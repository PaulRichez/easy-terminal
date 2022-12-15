# Easy terminal

An easy to use web terminal without any dependency and minified.

## Installation

```
npm i easy-terminal
```

## Usage

see the [example folder](https://github.com/PaulRichez/easy-terminal/tree/master/example/vanillaJS) for a complete case.


```js
const EasyTerminal = require('easy-terminal');
const terminalElement = window.document.getElementById('terminal'); // div where you want the terminal
new EasyTerminal({
    elementHtml: terminalElement,
    window: { show: true, title: 'EasyTerminal' },
    nativeCommands: true,
    welcome: 'Welcome to EasyTerminal',
    history: true,
    noEmptyCommand: true,
    customCommands: [
        {
            name: 'test',
            help: 'test command',
            method: async function (cmd) {
                return await cmd.select(objTest, true)
            }
        },
        {
            name: 'test2',
            help: 'test2 command',
            method: async function (cmd) {
                return await cmd.select(stringsTest, false)
            }
        },
        {
            name: 'askAge',
            help: 'ask age to user',
            method: async function (cmd) {
                const age = await cmd.ask('age ?', true);
                cmd.echo('Age: ' + age);
            }
        }
    ]
});
```

## Config
#### Terminal Config
| name           | type             | default | desc                                                 |
| -------------- | ---------------- | ------- | ---------------------------------------------------- |
| window         | Object           | N/A     | Some style for the termianal                         |
| welcome        | String           | null    | Welcome message (first line)                         |
| elementHtml    | HTMLElement      | null    | div where you want the terminal                      |
| data-ps        | string           | $       | Char before command input                            |
| history        | boolean          | false   | If yes you can access history with arrow up and down |
| noEmptyCommand | boolean          | false   | If true cancel empty command                         |
| nativeCommands | boolean          | false   | Native commands are help and clear                   |
| customCommands | ITerminalCommand | N/A     | Pass you're commands here                            |

#### Window interface
 | name      | type    | default        | desc                |
 | --------- | ------- | -------------- | ------------------- |
 | show      | boolean | false          | Show a window       |
 | title     | string  | 'EasyTerminal' | Title of the window |
 | bgColor   | string  | #198754        | Background color    |
 | textColor | string  | white          | Text color          |
#### ITerminalCommand interface
 | name   | type     | required | desc                      |
 | ------ | -------- | -------- | ------------------------- |
 | name   | string   | true     | Command name              |
 | method | function | true     | function called           |
 | help   | string   | true     | Text show on help command |

 ## License
[ISC](https://gist.github.com/indexzero/10602128#file-isc-md) 