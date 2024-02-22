# <img alt="Bundown" src='packages/docs/bundown.svg'>

[![bundown license](https://img.shields.io/npm/l/bundown.svg?colorB=567&label)](https://github.com/rysana-ai/bundown/blob/main/license) [![bundown package version](https://img.shields.io/npm/v/bundown.svg?colorB=284&label)](https://www.npmjs.com/package/bundown) [![bundown source code size](https://img.shields.io/github/languages/code-size/rysana-ai/bundown?colorB=44e&label)](https://github.com/rysana-ai/bundown) [![bundown speed](https://img.shields.io/static/v1?label&message=blazingly%20fast&color=b22)](https://twitter.com/jrysana/status/1754329326600741266)

**Bundown** is a fast all-in-one Markdown runtime and bundler.

You can install `bundown` (`bd`) globally using [Bun](https://bun.sh):

```sh -t install
bun i -g bundown
```

Bundown runs TS, JS, Shell, Python, and Go code. It pretty-prints and syncs code in almost any language.




## Links

+ [Usage](#usage)
+ [Contributing](#contributing)
+ [Scripts](#scripts)
    + [Format](#format)
+ [Docs](packages/docs)
    + [Changelog](packages/docs/changelog.md)
    + [Roadmap](packages/docs/roadmap.md)
    + [Ideas](packages/docs/ideas.md)
+ [Examples](packages/examples)
+ [Source](packages/core/bundown.ts)
+ [MIT License](license)




## Usage

+ `bundown run`        to run a Markdown file from a path or URL
+ `bundown sync`       to pack/unpack code between files and Markdown
+ `bundown -h`         to view help 
+ `bundown upgrade`    to update Bundown




## Contributing

If you have any bugs, feature requests, etc. please open a [discussion](https://github.com/rysana-ai/bundown/discussions), [issue](https://github.com/rysana-ai/bundown/issues) or [pull request](https://github.com/rysana-ai/bundown/pulls) as appropriate.

Before you open a PR, use [this script](#clean) to format the code with `biome`. We use an opinionated style guide, aimed at maximizing the intuitive readability of code and minimizing noisy syntax - follow it.

We also have a [roadmap](packages/docs/roadmap.md) of planned features and bugs we'd like to fix if you'd like to pick one up:




## Scripts

If you have Bundown installed, you can run any of the following scripts with `bundown . -t <script>`


### Clean

Use this script to unfold config files, install dependencies, and lint + format with Biome for TS/JS/JSON and Sherif for monorepo setup. Please run this script before you push any commits to ensure that our formatting and guidelines are followed.

```sh -t clean
bun x del-cli **/node_modules
bundown sync packages/config.md .
bun install
bun x biome format --write .
bun x biome check . --apply-unsafe
bun x sherif
```
