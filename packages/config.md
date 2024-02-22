# Config files

We use this folded Bundown file to configure our packages and developer tooling.

Soon, we'll replace these JSON blocks with TS blocks that transpile to JSON automatically via `bd sync`, allowing us to share code between them.




## Packages


### Monorepo root

```json -f package.json
{
  "name": "@bundown/root",
  "private": true,
  "workspaces": ["packages/*"],
  "devDependencies": {
    "@biomejs/biome": "^1.5.3",
    "bun": "^1.0.24"
  },
  "packageManager": "bun@1.0.24"
}
```


### Core `bundown` package

```json -f packages/core/package.json
{
  "name": "bundown",
  "version": "0.1.2",
  "description": "Bundown is a fast all-in-one Markdown runtime.",
  "keywords": ["bundown", "bun", "markdown", "runtime", "typescript", "javascript", "shell"],
  "license": "MIT",
  "homepage": "https://rysana.com/bundown",
  "bugs": "https://github.com/rysana-ai/bundown/issues",
  "repository": { "type": "git", "url": "https://github.com/rysana-ai/bundown.git" },
  "bin": { "bundown": "./bundown.ts", "bd": "./bundown.ts" },
  "dependencies": {
    "bun": "^1.0.24",
    "chalk": "^5.3.0",
    "emphasize": "^7.0.0",
    "mdast-util-from-markdown": "^2.0.0",
    "mdast-util-gfm": "^3.0.0",
    "mdast-util-math": "^3.0.0",
    "mdast-util-to-markdown": "^2.1.0",
    "micromark-extension-gfm": "^3.0.0",
    "micromark-extension-math": "^3.0.0",
    "string-width": "^7.1.0",
    "wrap-ansi": "^9.0.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.5.3",
    "@types/bun": "^1.0.5",
    "@types/node": "^20.11.16",
    "typescript": "^5.3.3"
  },
  "os": ["darwin", "linux"],
  "cpu": ["arm64", "x64"]
}
```


### Docs

```json -f packages/docs/package.json
{
  "name": "@bundown/docs",
  "private": true
}
```


### Examples

```json -f packages/examples/package.json
{
  "name": "@bundown/examples",
  "private": true
}
```




## Bun

```toml -f bunfig.toml
[install.lockfile]
print = "yarn"
```




## TypeScript

```json -f tsconfig.json
{
  "compilerOptions": {
    "lib": ["esnext"],
    "target": "esnext",
    "module": "esnext",
    "moduleDetection": "force",
    "jsx": "preserve",
    "paths": { "~/*": ["./*"] },
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "allowJs": true,
    "skipLibCheck": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "verbatimModuleSyntax": true,
    "noUncheckedIndexedAccess": true,
    "allowImportingTsExtensions": true,
    "noFallthroughCasesInSwitch": true,
    "useUnknownInCatchVariables": true,
    "forceConsistentCasingInFileNames": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
````




## Biome

```json -f biome.json
{
  "$schema": "https://biomejs.dev/schemas/1.5.3/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "formatter": {
    "enabled": true,
    "indentWidth": 2,
    "indentStyle": "space",
    "lineWidth": 99,
    "formatWithErrors": true
  },
  "javascript": {
    "formatter": {
      "trailingComma": "all",
      "bracketSameLine": true,
      "quoteStyle": "single",
      "jsxQuoteStyle": "single",
      "quoteProperties": "asNeeded",
      "semicolons": "asNeeded",
      "arrowParentheses": "asNeeded"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "all": true,
      "complexity": { "useSimplifiedLogicExpression": "off" },
      "correctness": { "noUndeclaredVariables": "off" },
      "style": {
        "noParameterAssign": "off",
        "useTemplate": "off"
      },
      "suspicious": {
        "noExplicitAny": "off",
        "noConsoleLog": "off",
        "noAssignInExpressions": "off"
      },
      "nursery": {
        "noDuplicateJsonKeys": "error",
        "noEmptyBlockStatements": "error",
        "noEmptyTypeParameters": "error",
        "noGlobalAssign": "error",
        "noInvalidUseBeforeDeclaration": "error",
        "noThenProperty": "error",
        "noUnusedImports": "error",
        "noUnusedPrivateClassMembers": "error",
        "noUselessLoneBlockStatements": "error",
        "noUselessTernary": "error",
        "useAwait": "error",
        "useConsistentArrayType": "error",
        "useFilenamingConvention": "off",
        "useExportType": "error",
        "useImportType": "error",
        "useGroupedTypeImport": "error",
        "useNodejsImportProtocol": "off",
        "useNumberNamespace": "error",
        "useShorthandFunctionType": "error"
      }
    }
  }
}
```
