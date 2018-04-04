/**
 * @file loader
 * @author zhangsiyuan(zhangsiyuan@baidu.com)
 */
const loaderUtils = require('loader-utils');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const hash = require('hash-sum');
const posthtml = require('posthtml');
const gen = require('@babel/generator').default;

const isProduction = process.env.NODE_ENV === 'production';

module.exports = function (content) {
    const options = loaderUtils.getOptions(this) || {};
    const {
        rootContext = process.cwd(),
        resourcePath
    } = this;
    let output = '';
    const webpackContext = this;

    // const sourceMap = options.sourceMap;
    // const fileName = path.basename(filePath);
    // const sourceRoot = path.dirname(path.relative(context, filePath));
    const shortFilePath = path.relative(rootContext, resourcePath).replace(/^(\.\.[\\\/])+/, '');

    const res = posthtml([
        // 1 分开script、template、style
        require('./posthtml-san-selector')({webpackContext}),

        require('./posthtml-remove-indent')({webpackContext})

    ]).process(content, {
        // 你真的不知道为了这个options我搞了多久
        // shit@ post html docs
        recognizeSelfClosing: true,
        sync: true
    });

    const sanScriptAst = require('./move-template-into-script')(webpackContext);
    const scriptStr = gen(sanScriptAst).code;
    const sanStyleAst = webpackContext._compilation.__sanParts__.style;
    // <style> exists
    if (sanStyleAst.length) {
        function calcedStyleImport(rootContext, resourcePath) {
            const styleLoader = isProduction ?
                `${rootContext}/node_modules/mini-css-extract-plugin/dist/loader.js`
                : 'style-loader';
            const cssLoader = 'css-loader?' + (webpackContext.query.cssLoader
                ? JSON.stringify(webpackContext.query.cssLoader).replace(/"/g, '\\"')
                : '\{sourceMap:true,importLoaders:1\}');
            const postcssLoader = 'postcss-loader?sourceMap=true';
            const stylusLoader = 'stylus-loader';

            return `import "!!${styleLoader}!${cssLoader}!${postcssLoader}!${
                sanStyleAst[0].attrs && sanStyleAst[0].attrs.lang === 'stylus'
                    ? stylusLoader + '!'
                    : ''
                }${rootContext}/lib/selector.js!${resourcePath}"\n`;
        }

        output += calcedStyleImport(rootContext, resourcePath);
        console.log(output);
    }

    output += scriptStr;
    return output;
};
