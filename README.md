# san-webpack-loader
🌈 a webpack-v4 loader for San.js ☄️

![san-webpack-loade](http://ov35lvdq9.bkt.clouddn.com/san-webpack-hot.gif)

## install

```js
  npm install san-webpack-loader
  or
  yarn add san-webpack-loader
```
## usage

```js
@file: webpack.config.js
{
  test: /\.san$/,
  include: /src/,
  use: [
    {loader: 'babel-loader?cacheDirectory=true'},
    {loader: 'san-webpack-loader'}
  ]
}
```

## 重写的初衷 AOT vs JIT
1. 避免运行时编译的代价
2. 避免把编译器发送到浏览器里
3. 极致的开发体验和效率

## 相比san-loader:

1. 构建后的san组件业务代码体积缩小60%
2. 相比san-loader复杂的配置项，零配置&&开箱即用
3. 业务组件script时间减少30%
4. 组件级别热重载
5. 通过template literal静态连接模板和js
6. 更少的构建时间

## todo
1. webpack4 Boilerplate 多线程优化
2. css in js 方案

## 目标
1. 极小的产出体积
2. 更快的运行时解析
3. 零配置
4. 更好的开发体验
5. 有文档 📖
6. 更好的业务服务集成

## LISENCE
  MIT
