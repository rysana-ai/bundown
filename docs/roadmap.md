# Roadmap

See what's already been done in [`changelog.md`](changelog.md)

> This roadmap is an early work-in-progress and subject to change - please feel free to suggest additions, removals, changes etc.

#### Features

+ `bundown --tag <tag> <file>` (`-t`) runs only code blocks with the specified tag.
  + `--tag <tag>` (`-t`) in a codeblock meta header tags the codeblock with `<tag>`.
  + `bundown <file>` does not run code blocks with a `--tag` flag.
+ `bundown` auto-detects operating system only runs corresponding codeblocks.
  + `--os <os>` in a codeblock meta header tags the codeblock with `<os>`.
  + `linux` and `macos`/`darwin` are supported `<os>` tags.
+ `bundown sync` synchronizes Markdown codeblocks with actual code files using file tags in the codeblock metadata:
  + `--file <file>` (`-f`) in a codeblock meta header sets the corresponding file.
  + `bundown <file>` does not run code blocks with a `--file` flag.
  + `bundown sync <file> <dir>` (over)writes files in `<dir>` with corresponding codeblocks from `<file>`.
    + `--delete` deletes files in `<dir>` without corresponding codeblocks in `<file>`.
  + `bundown sync <dir> <file>` (over)writes codeblocks in `<file>` with corresponding files from `<dir>`.
    + `--no-new-blocks` does not create new codeblocks in `<file>` for files in `<dir>` without corresponding codeblocks.
  + `bundown sync bundown.md .` is used to sync the `bundown` codebase from a single file.
+ `bundown https://example.com/file.md` runs a Markdown file from a URL.
+ `bundown --interactive <file>` (`-i`) pretty-prints each code block before running with a Y/N prompt to run it.
  + `bundown` detects potentially unsafe code and prompts the user to run interactively if so.
+ `bundown` uses source mapping to deliver helpful and traceable error messages when code blocks or individual lines of code fail.
+ `bundown ai` uses the core runtime, pretty-printing, and safe execution to deliver a great private, local, open-source alternative interface to LLM chat/search/code apps.
+ `... | bundown` can be used to pipe Markdown into `bundown` instead of using a file path.

#### Improvements

+ `bundown --print` uses syntax-highlighting in printed code blocks.
+ `bundown --print` visually formats Markdown segments (bold, italic, color, etc.)
+ `bundown` should properly escape the content of Shell code blocks when compiling the executed TypeScript file.

#### Languages
+ `bundown` shares variables and functions between code blocks, regardless of language.
+ `bundown` can print and sync: `json`, `yaml`, `toml`, `html`, `xml`, `svg`, `css`, `sass`, `scss`, `.gitignore`, `python`, `sql`, `c#`, `c++`, `c`, `zig`, `rust`, `php`, `go`, `kotlin`, `java`, `ruby`, `lua`, `assembly`, `swift`, `r`, `haskell`, `lisp`, `clojure`, `julia`, `brainfuck`, `latex`, and more?
+ `bundown` can run: `python`, `c#`, `c++`, `c`, `zig`, `rust`, `php`, `go`, `ruby`, `lua`, `assembly`, `lisp`, `clojure`, `julia`, `brainfuck`, and more?
