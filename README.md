# OkiSys

A terminal-based system dashboard built with [Ink](https://github.com/vadimdemedes/ink).

![OkiSys](img/screenshot.png)

## What it shows

- **System Specs** — CPU, GPU, RAM (type/speed/slots), storage, OS info
- **Performance** — live CPU, RAM, and GPU usage with progress bars
- **Network** — interface name, download/upload speed, internet latency
- **Command Log** — history of commands run in the session

## Commands

| Command | Description |
|---|---|
| `goto <url>` | Open a URL in your browser |
| `search <query>` | Search the query in your browser |
| `github <username>` | Open a GitHub profile |
| `exit` | Quit |
| `okisys` | Open OkiSys repository on github |
| `time` | Get current time |

Use the up/down arrow keys to cycle through command history.

## Usage

```bash
npm test
```
