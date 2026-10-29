export function isNumber(str: string): boolean {
  return /^[0-9]+$/.test(str);
}