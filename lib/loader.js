/**
 * @file loader
 * @author zhangsiyuan(zhangsiyuan@baidu.com)
 */

const path = require('path');
const hash = require('hash-sum');
const posthtml = require('posthtml');
const gen = require('@babel/generator').default;

module.exports = function (content) {
    this.cacheable();
    const {
        query: options,
        rootContext: context = process.cwd(),
        resourcePath: filePath
    } = this;

    let output = '';
    const webpackContext = this;
    const isProduction = options.minimize || process.env.NODE_ENV === 'production';

    // const sourceMap = options.sourceMap;
    // const fileName = path.basename(filePath);
    // const sourceRoot = path.dirname(path.relative(context, filePath));
    const shortFilePath = path.relative(context, filePath).replace(/^(\.\.[\\\/])+/, '');
    // 生成moduleId惰性函数
    const genModuleId = () => 'm-' + hash(isProduction
        ? (shortFilePath + '\n' + content)
        : shortFilePath
    );

    const res = posthtml([
        // 1 分开script、template、style
        require('./posthtml-san-selector')(),
        // 2 注入scoped需要的attr 如果需要moduleId会挂在webpackContext._compilation._sanModuleId上
        require('./posthtml-add-attrs')(webpackContext, {genModuleId})
    ]).process(content, {
        // 你真的不知道为了这个options我搞了多久
        // shit@ post html docs
        recognizeSelfClosing: true,
        sync: true
    });

    const sanScriptAst = require('./move-template-into-script')(res.tree);
    const scriptStr = gen(sanScriptAst).code;

    // +++++++++++++++++++++++++++++++++++++++++++++++++++
    require('fs').writeFileSync('./test.js', scriptStr);
    // +++++++++++++++++++++++++++++++++++++++++++++++++++

    output += scriptStr;
    return output;
};
