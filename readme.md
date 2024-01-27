![bundown logo](docs/bundown.svg)

# Bundown

**Bundown** is a fast all-in-one Markdown runtime and bundler, built on [Bun](https://bun.sh).

It runs Markdown files, executing their Shell, JavaScript, and TypeScript code blocks.

[![bundown license](https://img.shields.io/npm/l/bundown.svg?colorB=slategray&label)](https://github.com/rysana-ai/bundown/blob/main/license) [![bundown package version](https://img.shields.io/npm/v/bundown.svg?colorB=limegreen&label)](https://www.npmjs.com/package/bundown) [![bundown source code size](https://img.shields.io/github/languages/code-size/rysana-ai/bundown?colorB=royalblue&label)](https://github.com/rysana-ai/bundown) [![bundown speed](https://img.shields.io/static/v1?label=speed&message=fast&color=chocolate)](https://twitter.com/jarredsumner/status/1542824445810642946)

## Installation

If you haven't already, start by installing Bun:

```sh
curl -fsSL https://bun.sh/install | bash
```

Next, install Bundown globally using Bun:

```sh
bun i -g bundown
```

Now you should be able to:

`bundown <file.md>` to run any Markdown file 

`bundown -h`        to view help 

`bundown upgrade`   to update Bundown

## Contributing

If you have any bugs, feature requests, etc. please open a [discussion](https://github.com/rysana-ai/bundown/discussions), [issue](https://github.com/rysana-ai/bundown/issues) or [pull request](https://github.com/rysana-ai/bundown/pulls) as appropriate.

Before you open a PR, please use [`bundown run/format.md`](run/format.md) to format the code with `biome`.

We also have a roadmap of planned features and bugs we'd like to fix at [`roadmap.md`](docs/roadmap.md) if you'd like to contribute by picking one up.

## Links

- [Source](bundown/bundown.ts)
- [Changelog](docs/changelog.md)
- [Roadmap](docs/roadmap.md)
- [MIT License](license)
- Scripts
    - [Format](run/format.md)
