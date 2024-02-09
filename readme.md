# <img alt="Bundown" src='bundown/bundown.svg'>

[![bundown license](https://img.shields.io/npm/l/bundown.svg?colorB=567&label)](https://github.com/rysana-ai/bundown/blob/main/license) [![bundown package version](https://img.shields.io/npm/v/bundown.svg?colorB=284&label)](https://www.npmjs.com/package/bundown) [![bundown source code size](https://img.shields.io/github/languages/code-size/rysana-ai/bundown?colorB=44e&label)](https://github.com/rysana-ai/bundown) [![bundown speed](https://img.shields.io/static/v1?label&message=blazingly%20fast&color=b22)](https://twitter.com/jrysana/status/1754329326600741266)

**Bundown** is a fast all-in-one Markdown runtime and bundler.

You can install `bundown` (`bd`) globally using [Bun](https://bun.sh):

```sh -t install
bun i -g bundown
```

Bundown runs TS, JS, and Shell code. It pretty-prints and syncs code in almost any language.




## Links

+ [Usage](#usage)
+ [Changelog](#changelog)
+ [Contributing](#contributing)
+ [Roadmap](#roadmap)
+ [Scripts](#scripts)
    + [Format](#format)
+ [Source](bundown/bundown.ts)
+ [MIT License](license)




## Usage

+ `bundown run`        to run a Markdown file from a path or URL
+ `bundown sync`       to pack/unpack code between files and Markdown
+ `bundown -h`         to view help 
+ `bundown upgrade`    to update Bundown




## Changelog

See what's planned in [the roadmap.](#roadmap)

### `^0.1.2`
+ **Improvements**
    + `bundown --print` uses improved box drawing for run & sync code printing.

### `^0.1.0`
+ **Features**
    + `bundown run <file>` now aliases `bundown <file>`.
    + `bundown sync` synchronizes Markdown codeblocks with actual code files using file tags in the codeblock metadata:
        + `--file <file>` (`-f`) in a codeblock meta header sets the corresponding file.
        + `bundown <file>` does not run code blocks with a `--file` flag.
        + `bundown sync <file> <dir>` (over)writes files in `<dir>` with corresponding codeblocks from `<file>`.
        + `bundown sync <url> <dir>` downloads and over(writes) the files in `<dir>` with codeblocks from `<url>`.
        + `bundown sync --print` (`-p`) pretty-prints the synced files.
    + `bundown https://example.com/file.md` runs a Markdown file from a URL.
    + `bundown --tag <tag> <file>` (`-t`) runs only code blocks with the specified tag.
        + `--tag <tag>` (`-t`) in a codeblock meta header tags the codeblock with `<tag>`.
        + `bundown <file>` does not run code blocks with a `--tag` flag.
    + `bundown` auto-detects operating system and only runs corresponding codeblocks.
        + `--os <os>` in a codeblock meta header tags the codeblock with `<os>`.
        + `linux` and `macos`/`darwin` are supported `<os>` tags.
    + `bundown <dir>` auto-detects the best potential default file like `readme.md` and runs it.
+ **Improvements**
    + `bundown` now has a block-level args parser for advanced features.
    + `bundown` now uses abstract syntax trees to parse and manipulate Markdown.
    + `bundown --print` uses syntax highlighting for code blocks and rich text.
+ **Languages**
    + `bundown` can print and sync: `c`, `cuda`, `c++`, `c#`, `css`, `diff`, `go`, `graphql`, `.gitignore`, `html`, `arduino`, `java`, `javascript`, `json`, `jsx`, `kotlin`, `less`, `lua`, `makefile`, `markdown`, `objective-c`, `perl`, `php`, `python`, `r`, `ruby`, `rust`, `scss`, `shell`, `sql`, `svg`, `swift`, `toml`, `tsx`, `typescript`, `xml`, `vb.net`, `wasm`, `yaml`, and many aliases for the aforementioned.

### `^0.0.10`
+ **Improvements**
    + `bundown upgrade` fixed.

### `^0.0.9`
+ **Improvements**
    + `bundown` checks that the user has `bun@^1.0.24` installed and reports a helpful error message if not.

### `^0.0.8`
+ **Improvements**
    + `bundown upgrade` upgrades `bundown` to the latest version.

### `^0.0.7`
+ **Improvements**
    + `package.json` now lists runtime dependencies.

### `^0.0.6`
+ **Features**
    + `bundown --version` (`-v`) prints the version of `bundown` installed.
    + `bundown --print <file>` (`-p`) pretty-prints the Markdown and syntax highlighted code blocks.
    + `bundown --help` (`-h`) prints a help message.
+ **Improvements**
    + `bundown` now uses ANSI colors for more helpful usage messages & pretty-printing.

### `^0.0.5`
+ **Features**
    + `bundown` recognizes languages regardless of case, allowing uppercase language names in code blocks.
+ **Improvements**
    + `bundown` now uses a single parser loop to run faster in less lines of code.

### `^0.0.4`
+ **Features**
    + `bundown` can run multiple instances at once.
    + `bundown` returns the same exit code as the code it ran.

### `^0.0.3`
+ **Improvements**
    + `bundown` has developer tooling including `biome` code formatting via `bundown` and a `.gitignore` file.

### `^0.0.2`
+ **Improvements**
    + `bundown` doesn't skip a code block if a supported language is specified in full but has extra whitespace/content on the language line.

### `^0.0.1`
+ **Features**
    + `bundown <file>` runs TypeScript, JavaScript, and Shell code blocks in Markdown files.
    + `bundown` can be installed globally using `npm`, `bun`, `pnpm`, or `yarn` and run from anywhere.




## Contributing

If you have any bugs, feature requests, etc. please open a [discussion](https://github.com/rysana-ai/bundown/discussions), [issue](https://github.com/rysana-ai/bundown/issues) or [pull request](https://github.com/rysana-ai/bundown/pulls) as appropriate.

Before you open a PR, use [this script](#format) to format the code with `biome`. We use an opinionated style guide, aimed at maximizing the intuitive readability of code and minimizing noisy syntax - follow it.

We also have a [roadmap](#roadmap) of planned features and bugs we'd like to fix if you'd like to pick one up:




## Roadmap

See what's already been done in [the changelog.](#changelog) Please suggest changes.

+ **Features**
    + `bundown sync <url> <file>` downloads and over(writes) the Markdown file from `<url>` into `<file>`.
    + `bundown sync <dir> <file>` (over)writes codeblocks in `<file>` with corresponding files from `<dir>`.
        + `--no-new-blocks` does not create new codeblocks in `<file>` for files in `<dir>` without corresponding codeblocks.
    + `bundown sync bundown.md .` is used to sync the `bundown` codebase from a single file.
    + `bundown sync --delete` deletes files/blocks in the destination that don't exist in the source.
    + `bundown --interactive <file>` (`-i`) pretty-prints each code block before running with a Y/N prompt to run it.
    + `bundown` detects potentially unsafe code and prompts the user to run interactively if so.
    + `bundown` uses source mapping to deliver helpful and traceable error messages when code blocks or individual lines of code fail.
    + `bundown ai` uses the core runtime, pretty-printing, and safe execution to deliver a great private, local, open-source alternative interface to LLM chat/search/code apps.
    + `... | bundown` can be used to pipe Markdown into `bundown` instead of using a file path.
    + `bundown tasks` allows you to view and manage task lists.
    + `bundown.config.md` allows a user to set a custom color theme for Bundown.
+ **Improvements**
    + `bundown` should safely escape the content of Shell code when compiling to TS.
    + `bundown --print` visually formats Markdown segments (code, links, etc.) beyond just syntax highlighting.
    + `bundown --print` supports GFM style autolinks.
    + `bundown --print` supports GFM style task lists.
    + `bundown --print` supports GFM style tables.
    + `bundown --print` supports GFM style footnotes.
    + `bundown --print` converts emoji codes like `:fire:` to actual emojis.
    + `bundown --print` pretty-prints math e.g. replacing common TeX characters e.g. `\pi` to `π`.
+ **Languages**
    + `bundown` shares variables and functions between code blocks, regardless of language.
    + `bundown` can print and sync: `sass`, `zig`, `assembly`, `haskell`, `lisp`, `clojure`, `julia`, `brainfuck`, `latex`, and more?
    + `bundown` can run: `python`, `c#`, `c++`, `c`, `zig`, `rust`, `php`, `go`, `ruby`, `lua`, `assembly`, `wasm`, `lisp`, `clojure`, `julia`, `brainfuck`, and more?




## Scripts

If you have Bundown installed, you can run any of the following scripts with `bundown -t <script>`


### Format

We use `biome` to format our code.

To format all files in the project, make sure you have `biome` installed and run:

```sh -t format
bun x biome format --write .
```
