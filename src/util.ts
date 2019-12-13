export const userAgent = window.navigator.userAgent.toLocaleLowerCase();

export function isIOS(): boolean {
  return /iphone|ipad|ipod|ios/.test(userAgent);
}

export function isAndroid(): boolean {
  return /android/i.test(userAgent);
}
