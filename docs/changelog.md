# Changelog

See what's planned in [`roadmap.md`](roadmap.md)

---

### `bundown@^0.0.10`

#### Improvements
+ `bundown upgrade` fixed. @jrysana

---

### `bundown@^0.0.9`

#### Improvements
+ `bundown` checks that the user has `bun@^1.0.24` installed and reports a helpful error message if not. @jrysana

---

### `bundown@^0.0.8`

#### Improvements
+ `bundown upgrade` upgrades `bundown` to the latest version. @arrysana

---

### `bundown@^0.0.7`

#### Improvements
+ `package.json` now lists runtime dependencies. @jrysana

---

### `bundown@^0.0.6`

#### Features
+ `bundown --version` (`-v`) prints the version of `bundown` installed. @jrysana
+ `bundown --print <file>` (`-p`) pretty-prints the Markdown and syntax highlighted code blocks. @jrysana
+ `bundown --help` (`-h`) prints a help message. @jrysana

#### Improvements
+ `bundown` now uses ANSI colors for more helpful usage messages & pretty-printing. @jrysana

---

### `bundown@^0.0.5`

#### Features
+ `bundown` recognizes languages regardless of case, allowing uppercase language names in code blocks. @emileferreira

#### Improvements
+ `bundown` now uses a single parser loop to run faster in less lines of code. @arrysana

---

### `bundown@^0.0.4`

#### Features
+ `bundown` can run multiple instances at once. @KaruroChori
+ `bundown` returns the same exit code as the code it ran. @KaruroChori

---

### `bundown@^0.0.3`

#### Improvements
+ `bundown` has developer tooling including `biome` code formatting via `bundown run/format.md` and a `.gitignore` file. @jrysana

---

### `bundown@^0.0.2`

#### Improvements
+ `bundown` doesn't skip a code block if a supported language is specified in full but has extra whitespace/content on the language line. @jrysana

---

### `bundown@^0.0.1`

#### Features
+ `bundown <file>` runs TypeScript, JavaScript, and Shell code blocks in Markdown files. @jrysana
+ `bundown` can be installed globally using `npm`, `bun`, `pnpm`, or `yarn` and run from anywhere. @jrysana
