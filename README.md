# webview-bridge-help
## 基于以下package使用：
### [Android](https://github.com/lzyzsd/JsBridge)
### [IOS](https://github.com/marcuswestin/WebViewJavascriptBridge)


# 使用方法

```js
import { initWebviewJsBridge } from 'webview-bridge-help'
```

### 如果IOS用的UIWebview, 第二个参数为false, 默认WKWebview

```js
initWebviewJsBridge((bridge) => {`
    bridge.registerHandler('functionInJs', (dataFromNative, callback) => {
      ....
      callback()
    });

    bridge.callHandler('functionInNative', {}, (dataFromNative) => {
        // do somthing
    })
`}, false)
```

### 按钮等触发的原生调用 invokeNativeFunc
#### 方法返回promise
#### 参数信息： 原生功能名， 功能参数，是否返回JSON， 无返回提示信息，第一个参数必须。
```js
  import { invokeNativeFunc } from 'webview-bridge-help'

  invokeNativeFunc(functionName, params, isReturnObj, emptyMessage)
```