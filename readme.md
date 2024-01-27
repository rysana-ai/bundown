<img src='docs/bundown.svg' height=64>

# Bundown

**Bundown** is a fast all-in-one Markdown runtime and bundler, built on [Bun](https://bun.sh).

It runs Markdown files, executing their Shell, JavaScript, and TypeScript code blocks.

[![bundown license](https://img.shields.io/npm/l/bundown.svg?colorB=567&label)](https://github.com/rysana-ai/bundown/blob/main/license) [![bundown package version](https://img.shields.io/npm/v/bundown.svg?colorB=3b6&label)](https://www.npmjs.com/package/bundown) [![bundown source code size](https://img.shields.io/github/languages/code-size/rysana-ai/bundown?colorB=64e&label)](https://github.com/rysana-ai/bundown) [![bundown speed](https://img.shields.io/static/v1?label=speed&message=fast&color=c43&labelColor=a32)](https://twitter.com/jarredsumner/status/1542824445810642946)

## Installation

You can install Bundown globally using [Bun](https://bun.sh):

```sh
bun i -g bundown
```

Now you should be able to:

+ `bundown <file.md>` to run any Markdown file 
+ `bundown -h`        to view help 
+ `bundown upgrade`   to update Bundown

## Links

+ [Source](bundown/bundown.ts)
+ [MIT License](license)
+ Docs
    + [Contributing](docs/contributing.md)
    + [Changelog](docs/changelog.md)
    + [Roadmap](docs/roadmap.md)
+ Scripts
    + [Format](run/format.md)
