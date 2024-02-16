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
