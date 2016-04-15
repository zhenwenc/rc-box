export function check(target: any, message: string) {
  if (!target) {
    throw new Error(`[RCBOX] ${message}`)
  }
  return target
}
