# tmt-wechat
这是一个微信开发的Node SDK，根据开发者文档里的接口包装了一层从而简化地实现相对于的功能。

## 使用方法
首先安装`tmt-wechat`工具包，然后引入到文件并且传入一些简单的配置来实例化后，便可使用对应api。

```
npm install tmt-wechat --save
or 
yarn add tmt-wechat
```

在主文件引入：
```
// 引入tmt-wechat
const TmtWechat = require('tmt-wechat');

// 定义配置
const twtConfig = {
  appId: 'xxx',
  appScrect: 'yyy',
}

// 实例化
const twt = new TmtWechat(twtConfig);

// 调用方法
twt.getAcToken().then(res => {
  // do something...
})
```

## 基础配置

- twtOptions.appId 公众号的appId
- twtOptions.appScrect 公众号的appScrect

## API
下面是`tmt-wechat`里包含的api列表：

### twt.getAcToken
获取用户accessToken方法。
使用如下：

```
twt.getAcToken().then(res => {})
```

其中res返回的对象包含如下：
```
{
  msg: '', // 提示信息
  data: acTokenData || null, // 微信返回的数据，错误是为null
  code: '' // 错误码（微信返回）
}
```

