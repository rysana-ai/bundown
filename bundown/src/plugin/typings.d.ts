// ----------------------------------------------------------- For importing Markdown modules in TypeScript

declare module "*.md" {
  const exports: import('./index').MarkdownExports;
  export default exports;
}

declare module "*.markdown" {
  const exports: import('./index').MarkdownExports;
  export default exports;
}

declare module "*.bundown" {
  const exports: import('./index').MarkdownExports;
  export default exports;
}

// ----------------------------------------------------------- For importing other modules in TypeScript

declare module "*.sh" {
  const exports: import('./index').CallExports;
  export default exports;
}

declare module "*.py" {
  const exports: import('./index').CallExports;
  export default exports;
}

declare module "*.go" {
  const exports: import('./index').CallExports;
  export default exports;
}
