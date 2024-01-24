# **Bundown** [![bundown minzip package size](https://img.shields.io/bundlephobia/minzip/bundown?label=zipped)](https://www.npmjs.com/package/bundown) [![bundown package version](https://img.shields.io/npm/v/bundown.svg?colorB=green)](https://www.npmjs.com/package/bundown) [![bundown license](https://img.shields.io/npm/l/bundown.svg?colorB=lightgrey)](https://github.com/rysana-ai/bundown/blob/main/license)

Bundown is a fast all-in-one Markdown runtime. It is built on top of [`bun ^1.0.24`](https://bun.sh) and can run Markdown files, combining and executing their Shell, JavaScript, and TypeScript code blocks.

## Installation

If you haven't already, start by installing Bun:

```sh
curl -fsSL https://bun.sh/install | bash
```

Next, install Bundown globally using Bun:

```sh
bun i -g bundown
```

Now you should be able to run any Markdown file with `bundown <file.md>`.

## Contributing

If you have any bugs/issues, feature requests, etc. please open an issue or pull request on [GitHub](https://github.com/rysana-ai/bundown).

Use [`bundown format.md`](format.md) to format the code with `biome`.
