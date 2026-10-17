/* Global action registry.
 * The UI is rendered from template strings (as in the base prototype), so inline handlers
 * call `A.name(...)`. Each module registers its handlers here instead of polluting window. */
type Fn = (...args: any[]) => any;
export const A: Record<string, Fn> = {};
export function reg(fns: Record<string, Fn>) {
  Object.assign(A, fns);
}
declare global {
  interface Window {
    A: Record<string, Fn>;
  }
}
window.A = A;
