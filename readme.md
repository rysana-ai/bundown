<img src='etc/bundown.svg'/>

# Bundown [![bundown package version](https://img.shields.io/npm/v/bundown.svg?colorB=green)](https://www.npmjs.com/package/bundown) [![bundown source code size](https://img.shields.io/github/languages/code-size/rysana-ai/bundown?colorB=blue&label=source)](https://github.com/rysana-ai/bundown) [![bundown license](https://img.shields.io/npm/l/bundown.svg?colorB=lightgrey)](https://github.com/rysana-ai/bundown/blob/main/license)

**Bundown** is a fast all-in-one Markdown runtime and bundler. It is built on top of [Bun](https://bun.sh) and can run Markdown files, combining and executing their Shell, JavaScript, and TypeScript code blocks.

## Installation

If you haven't already, start by installing `bun@^1.0.25`:

```sh
curl -fsSL https://bun.sh/install | bash
```

Next, install Bundown globally using Bun:

```sh
bun i -g bundown
```

Now you should be able to run any Markdown file with `bundown <file.md>`.

## Contributing

If you have any bugs, feature requests, etc. please open a [discussion](https://github.com/rysana-ai/bundown/discussions), [issue](https://github.com/rysana-ai/bundown/issues) or [pull request](https://github.com/rysana-ai/bundown/pulls) as appropriate.

Before you open a PR, please use [`bundown format.md`](format.md) to format the code with `biome`.

We also have a roadmap of planned features and bugs we'd like to fix at [`roadmap.md`](roadmap.md) if you'd like to contribute by picking one up.
