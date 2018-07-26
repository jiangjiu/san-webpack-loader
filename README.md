
<div align="center">
    <img src="https://b.bdstatic.com/searchbox/icms/searchbox/img/san-icon.png"></img>
    <h1> san-webpack-loader</h1>
    <p>🌈 a webpack-v4 loader for San.js ☄️</p>
</div> 


[文档请点这里](https://jiangjiu.github.io/san-webpack-loader/#/README)

![](https://img.shields.io/github/release/jiangjiu/san-webpack-loader.svg)
![](http://progressed.io/bar/80?title=done)
![](https://img.shields.io/npm/dt/san-webpack-loader.svg)

![san-webpack-loade](http://ov35lvdq9.bkt.clouddn.com/san-webpack-hot.gif)

## Install

```js
  npm install san-webpack-loader
  or
  yarn add san-webpack-loader
```
## Usage

```js
@file: webpack.config.js

// make sure the process.env.NODE_ENV is 'production' or 'development'
{
  test: /\.san$/,
  include: /src/,
  use: [
    {loader: 'babel-loader?cacheDirectory=true'},
    {loader: 'san-webpack-loader'}
  ]
}
```


## TODO
1. ~~webpack4 Boilerplate 多线程优化~~
2. css in js 方案

## CHANGELOG
### 1.1.2
    [BUG修复] 
    - 随官方升级babelrc的设置，推荐在业务中使用babel.config.js
    
### 1.1.1
    [新特性]
    - 升级babel依赖
    - 增加cache-loader options做文件缓存  需要安装cache-loader
    - 生产环境默认关闭sourcemap

## License
  MIT
