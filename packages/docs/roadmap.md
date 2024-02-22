# Roadmap

See what's already been done in [the changelog.](./changelog) Please suggest changes.

This roadmap is for changes to Bundown we've already planned - for ideas we're considering, see the [ideas](./ideas) file.

+ **Features**
    + `bundown ai` uses the core runtime, pretty-printing, and safe execution to deliver a great private, local, open-source alternative interface to LLM chat/search/code apps.
    + `bundown --interactive <file>` (`-i`) pretty-prints each code block before running with a Y/N prompt to run it.
    + `bundown` detects potentially unsafe code and prompts the user to run interactively if so.
    + `bundown` uses source mapping to deliver helpful and traceable error messages when code blocks or individual lines of code fail.
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
    + `bundown` can run: `c#`, `c++`, `c`, `zig`, `rust`, `php`, `ruby`, `lua`, `assembly`, `wasm`, `lisp`, `clojure`, `julia`, `brainfuck`, and more?
