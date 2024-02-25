# Changelog

See what's planned in [the roadmap.](./roadmap.md)

### `^0.2.0`
+ **Features**
    + [ ] `bundown <file> #<name>` runs all codeblocks within the Markdown heading `<name>`.
    + [ ] `bundown sync <url> <file>` downloads and over(writes) the Markdown file from `<url>` into `<file>`.
    + [ ] `bundown sync <dir> <file>` (over)writes codeblocks in `<file>` with corresponding files from `<dir>`.
        + `--no-new-blocks` does not create new codeblocks in `<file>` for files in `<dir>` without corresponding codeblocks.
    + [ ] `bundown sync --delete` deletes files/blocks in the destination that don't exist in the source.
    + [ ] `bundown` can be imported as a library in TS/JS.
    + [ ] `bundown` is now also a Bun plugin:
        + `import file from 'file.md'` supported in TS/JS:
            + `file.markdown.tree` exports the AST of the whole file.
            + `file.run()` runs the file with the Bundown runtime.
            + `file.blocks` exports the code blocks in the file.
        + `bun file.md` runs a Markdown file with the Bundown runtime through Bun.
    + [ ] `--runtime` (`-r`) selects a specific runtime for the file, e.g. `python3`, `node`, etc.
        + works as a code block flag
        + works as a CLI flag
+ **Improvements**
    + [ ] `bundown` runtime always syncs files with `-f` flags before running.
    + [ ] `bundown` runtime writes and destroys temp files at `{block_hash}.{ext}`.
    + [ ] `github://` and `gist://` URIs are now supported in source resolver.
    + [ ] `--os` flag now supports `platform-arch` specifiers, e.g. `linux-x64`.
    + `bundown sync packages/config.md .` is used to unfold much of the Bundown codebase from a single file.
+ **Languages**
    + [ ] `bundown` can now run `python` and `go`.
        + `bun file.py`, `bun file.go`, `bun file.sh` work through the Bundown plugin.
        + `import { call } from 'file.py'` (or `.go`, `.sh`) returns `{ exitCode, stdout, stderr }`.

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
