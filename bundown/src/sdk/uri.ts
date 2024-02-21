import { lstat } from 'node:fs/promises'

export type UriType =
  | { type: 'directory'; path: string }
  | { type: 'file'; path: string }
  | { type: 'url'; url: URL }
  | { type: 'github'; org: string; repository: string; url: URL }
  | { type: 'gist'; user: string; id: string; url: URL }

async function resolveUri(uri: string): Promise<UriType | undefined> {
  if (!uri) {
    return undefined
  }
  if (uri.startsWith('/') || uri.startsWith('./')) {
    if ((await lstat(uri)).isDirectory()) {
      return { type: 'directory', path: uri }
    }
    return { type: 'file', path: uri }
  }
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return { type: 'url', url: new URL(uri) }
  }
  if (uri.startsWith('github://')) {
    const [org, repo, ...rest] = uri.substring('github://'.length).split('/')
    if (!org || !repo || rest.length !== 0) return undefined
    const repository = repo.endsWith('.git') ? repo : `${repo}.git`
    return {
      type: 'github',
      org,
      repository,
      url: new URL(
        `https://github.com/${encodeURIComponent(org)}/${encodeURIComponent(repository)}`,
      ),
    }
  }
  if (uri.startsWith('gist://')) {
    const [user, id, ...rest] = uri.substring('gist://'.length).split('/')
    if (!user || !id || rest.length !== 0) return undefined
    return {
      type: 'gist',
      user,
      id,
      url: new URL(
        `https://gist.githubusercontent.com/${encodeURIComponent(user)}/${encodeURIComponent(
          id,
        )}/raw`,
      ),
    }
  }
  return undefined
}

export const uri = {
  from: {
    raw: async (params: { uri: string }): Promise<UriType | undefined> =>
      await resolveUri(params.uri),
  },
}
