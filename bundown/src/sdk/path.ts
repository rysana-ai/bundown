import { join, resolve } from 'node:path'

/**
 * Use this function to create a path that is safe to use.
 * This is especially important when using user-supplied paths.
 *
 * This function prevents the following things:
 *
 * - poison null bytes
 * - directory traversal
 *
 * **WARNING**: This function DOES NOT prevent writing to things like
 * the root `/`, `/etc/passwd`, and other non-desirable places,
 * unless you use the `prefix` param below with a safe prefix.
 *
 * @param prefix - The prefix that will always be prepended to the
 * supplied `path`. This ensures that the resulting path will
 * always be inside of the `prefix` path. The prefix should not
 * be user-supplied. The prefix can be a relative path, and will
 * be resolved to an absolute path before use. If the prefix does
 * not end with a slash `/`, a slash will be appended to the end of
 * the prefix.
 * @param path - The potentially unsafe user-supplied path to make safe.
 * @returns The safe prefixed path to use, or a reason for why the path
 * isn't safe.
 *
 * @example
 * safePrefixedPath('./', './some-db') // => process.cwd() + '/some-db'
 * safePrefixedPath('./', '/some-db') // => process.cwd() + '/some-db'
 * safePrefixedPath('./', './../../some-db') // => 'Path traversal detected'
 * safePrefixedPath('./', '/../../some-db') // => 'Path traversal detected'
 */
function safePrefixedPath(
  prefix: string,
  path: string,
):
  | { safe: false; reason: 'Poison null bytes detected' }
  | { safe: false; reason: 'Path traversal detected' }
  | { safe: true; prefixed: string } {
  if (path.indexOf('\0') !== -1) return { safe: false, reason: 'Poison null bytes detected' }
  const resolved = join(resolve(prefix), '/')
  const prefixed = join(resolved, path)
  if (!prefixed.startsWith(resolved)) return { safe: false, reason: 'Path traversal detected' }
  return { safe: true, prefixed }
}

export const path = {
  from: {
    user: (prefix: `./${string}`, path: string) => safePrefixedPath(prefix, path),
  },
}
