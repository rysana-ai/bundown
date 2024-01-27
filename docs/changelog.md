# Changelog

See what's planned in [`roadmap.md`](roadmap.md)

### `bundown@^0.0.8`

#### Improvements

- [x] `bundown upgrade` upgrades `bundown` to the latest version. @arrysana

---

### `bundown@^0.0.7`

#### Improvements

- [x] `package.json` now lists runtime dependencies. @jrysana

---

### `bundown@^0.0.6`

#### Features

- [x] `bundown --version` (`-v`) prints the version of `bundown` installed. @jrysana
- [x] `bundown --print <file.md>` (`-p`) pretty-prints the Markdown and syntax highlighted code blocks. @jrysana
- [x] `bundown --help` (`-h`) prints a help message. @jrysana

#### Improvements

- [x] `bundown` now uses ANSI colors for more helpful usage messages & pretty-printing. @jrysana

---

### `bundown@^0.0.5`

#### Features

- [x] `bundown` recognizes languages regardless of case, allowing uppercase language names in code blocks. @emileferreira

#### Improvements

- [x] `bundown` now uses a single parser loop to run faster in less lines of code. @arrysana

---

### `bundown@^0.0.4`

#### Features

- [x] `bundown` can run multiple instances at once. @KaruroChori
- [x] `bundown` returns the same exit code as the code it ran. @KaruroChori

---

### `bundown@^0.0.3`

#### Improvements

- [x] `bundown` has developer tooling including `biome` code formatting via `bundown run/format.md` and a `.gitignore` file. @jrysana

---

### `bundown@^0.0.2`

#### Improvements

- [x] `bundown` doesn't skip a code block if a supported language is specified in full but has extra whitespace/content on the language line. @jrysana

---

### `bundown@^0.0.1`

#### Features

- [x] `bundown <file.md>` runs TypeScript, JavaScript, and Shell code blocks in Markdown files. @jrysana
- [x] `bundown` can be installed globally using `npm`, `bun`, `pnpm`, or `yarn` and run from anywhere. @jrysana
