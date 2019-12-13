declare global {
  interface Window {
    WebViewJavascriptBridge: IWebViewJavascriptBridge;
    WVJBCallbacks: ICallback[];
  }
}

export interface IWebViewJavascriptBridge {
  callHandler: (nativeFuncName: string, params?: {}, callback?: (res: string) => void) => Promise<{} | string>;
  registerHandler: (
    functionInJs: string,
    callback: (dataFromNative: string, responseCallback: (dataFromJs: any) => void) => void,
  ) => void;
  init: (callBack: (message: string, responseCallback: (data: any) => void) => void) => void;
}

export type ICallback = (bridge: IWebViewJavascriptBridge) => void;
