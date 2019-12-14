import { isIOS } from './util';

export interface IWebViewJavascriptBridge {
  callHandler: (nativeFuncName: string, params?: {}, callback?: (res: string) => void) => Promise<{} | string>;
  registerHandler: (
    functionInJs: string,
    callback: (dataFromNative: string, responseCallback: (dataFromJs: any) => void) => void,
  ) => void;
  init: (callBack: (message: string, responseCallback: (data: any) => void) => void) => void;
}

type ICallback = (bridge: IWebViewJavascriptBridge) => void;

function connectToWebview(callback: ICallback) {
  if (window.WebViewJavascriptBridge) {
    callback(window.WebViewJavascriptBridge);
  } else {
    document.addEventListener(
      'WebViewJavascriptBridgeReady',
      () => {
        callback(window.WebViewJavascriptBridge);
      },
      false,
    );
  }
}

function setupWebViewJavascriptBridge(callback: ICallback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  const WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(() => {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
}

export default function initWebviewJsBridge(initCallback: ICallback, isWKWebview = true) {
  if (isIOS() && isWKWebview) {
    setupWebViewJavascriptBridge(initCallback);
  } else {
    connectToWebview(bridge => {
      bridge.init((message: string, responseCallback: (data: any) => void) => {
        const data = {
          'Javascript Responds': 'Wee!',
        };
        responseCallback(data);
      });
      initCallback(bridge);
    });
  }
}

export function invokeNativeFunc(
  nativeFuncName: string,
  params = {},
  returnObj = true,
  emptyMessage = 'APP无返回内容',
) {
  if (!window.WebViewJavascriptBridge) {
    return Promise.reject(new Error(`当前APP不支持${nativeFuncName}功能`));
  }
  return new Promise((resolve, reject) => {
    window.WebViewJavascriptBridge.callHandler(nativeFuncName, params, res => {
      if (!res) {
        return reject(emptyMessage);
      }
      if (returnObj) {
        resolve(JSON.parse(res));
      } else {
        resolve(res);
      }
    });
  });
}

export * from './util';

declare global {
  interface Window {
    WebViewJavascriptBridge: IWebViewJavascriptBridge;
    WVJBCallbacks: ICallback[];
  }
}
