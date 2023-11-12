export function isDictionaryLike(obj: any): boolean {
  return !Array.isArray(obj) && typeof obj === 'object' && obj !== null
}
