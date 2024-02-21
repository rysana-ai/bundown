import { platform, arch as architecture } from 'node:process'
import { $, semver } from 'bun'

export type FriendlyOperatingSystem = 'linux' | 'mac' | 'windows'
export type OperatingSystem =
  | {
      type: 'friendly-architecture'
      friendly: FriendlyOperatingSystem
      architecture: NodeJS.Architecture
    }
  | { type: 'platform-architecture'; platform: NodeJS.Platform; architecture: NodeJS.Architecture }
  | { type: 'friendly'; friendly: FriendlyOperatingSystem }
  | { type: 'platform'; platform: NodeJS.Platform }
  | { type: 'architecture'; architecture: NodeJS.Architecture }

export const os = {
  oses: ['windows', 'mac', 'linux'] as const satisfies string[],
  platforms: [
    'aix',
    'android',
    'darwin',
    'freebsd',
    'haiku',
    'linux',
    'openbsd',
    'sunos',
    'win32',
    'cygwin',
    'netbsd',
  ] as const satisfies NodeJS.Platform[],
  architectures: [
    'arm',
    'arm64',
    'ia32',
    'mips',
    'mipsel',
    'ppc',
    'ppc64',
    'riscv64',
    's390',
    's390x',
    'x64',
  ] as const satisfies NodeJS.Architecture[],
  platform,
  architecture,
  matches: {
    os: (operatingSystem: OperatingSystem): boolean => {
      switch (operatingSystem.type) {
        case 'friendly-architecture':
          return (
            os.matches.os({ type: 'friendly', friendly: operatingSystem.friendly }) &&
            os.matches.os({ type: 'architecture', architecture: operatingSystem.architecture })
          )
        case 'platform-architecture':
          return (
            os.matches.os({ type: 'platform', platform: operatingSystem.platform }) &&
            os.matches.os({ type: 'architecture', architecture: operatingSystem.architecture })
          )
        case 'friendly':
          return (
            (operatingSystem.friendly === 'linux' && os.platform === 'linux') ||
            (operatingSystem.friendly === 'mac' && os.platform === 'darwin') ||
            (operatingSystem.friendly === 'windows' && os.platform === 'win32')
          )
        case 'platform':
          return operatingSystem.platform === os.platform
        case 'architecture':
          return operatingSystem.architecture === os.architecture
      }
    },
  },
  from: {
    name: (name?: string): OperatingSystem | undefined => {
      if (!name) return undefined
      const lowercase = name.toLowerCase()
      if (name.includes('-')) {
        const [first, second, ...rest] = lowercase.split('-')
        if (!first || !second || rest.length > 0) {
          return undefined
        }
        const architecture = os.from.name(second)
        if (architecture?.type !== 'architecture') {
          return undefined
        }
        const friendlyOrPlatform = os.from.name(first)
        if (friendlyOrPlatform?.type === 'friendly') {
          return {
            type: 'friendly-architecture',
            friendly: friendlyOrPlatform.friendly,
            architecture: architecture.architecture,
          }
        }
        if (friendlyOrPlatform?.type === 'platform') {
          return {
            type: 'platform-architecture',
            platform: friendlyOrPlatform.platform,
            architecture: architecture.architecture,
          }
        }
        return undefined
      }
      if (lowercase === 'linux' || lowercase === 'mac' || lowercase === 'windows') {
        return { type: 'friendly', friendly: lowercase }
      }
      if (os.platforms.includes(lowercase as (typeof os.platforms)[number])) {
        return { type: 'platform', platform: lowercase as (typeof os.platforms)[number] }
      }
      if (os.architectures.includes(lowercase as (typeof os.architectures)[number])) {
        return {
          type: 'architecture',
          architecture: lowercase as (typeof os.architectures)[number],
        }
      }
    },
  },
  has: {
    version: async (params: { name: string; version: { command: string; expected: string } }) => {
      const osHasBin = await os.has.bin({ name: params.name })
      if (!osHasBin.has) return { has: false } as const
      const version = await $`${osHasBin.bin} ${params.version.command}`
      if (version.exitCode === 1) return { has: false } as const
      const versionString = version.stdout.toString('utf-8')
      if (versionString !== params.version.expected) return { has: false } as const
      const order = semver.order(versionString, params.version.expected)
      const compatibility =
        order === 0
          ? 'versions are equal'
          : order === 1
            ? 'os is newer than expected'
            : order === -1
              ? 'os is older than expected'
              : undefined
      return {
        has: true,
        bin: osHasBin.bin,
        version: versionString,
        compatibility,
        semver: semver.satisfies(versionString, params.version.expected),
      } as const
    },
    bin: async (params: { name: string }) => {
      const bin = await $`command -v ${params.name}`
      if (bin.exitCode === 0) return { has: true, bin: bin.stdout.toString('utf-8') } as const
      return { has: false } as const
    },
  },
}
