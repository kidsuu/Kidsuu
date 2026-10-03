export function resolveAuthMode(
  development: boolean,
  requested: string | undefined,
): 'demo' | 'unconfigured' {
  return development && requested === 'demo' ? 'demo' : 'unconfigured';
}
