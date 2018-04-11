/**
 * @file loader
 * @author zhangsiyuan(zhangsiyuan@baidu.com)
 */
const path = require('path');
const posthtml = require('posthtml');
const gen = require('@babel/generator').default;
const isProduction = process.env.NODE_ENV === 'production';

module.exports = function (content) {
    const {
        rootContext = process.cwd(),
        resourcePath
    } = this;
    let output = '';
    const webpackContext = this;

    const shortFilePath = path.relative(rootContext, resourcePath).replace(/^(\.\.[\\\/])+/, '');

    const res = posthtml([
        // separate script、template、style
        require('./posthtml-san-selector')({webpackContext}),
        // optimize size
        require('./posthtml-remove-indent')({webpackContext})

    ]).process(content, {
        // almost gave up
        // shit@ post html docs
        recognizeSelfClosing: true,
        sync: true
    });

    // <style> exists
    const sanStyle = webpackContext._compilation.__sanParts__.style;
    if (sanStyle.content) {
        output += require('./calc-style-Import')({
            webpackContext,
            sanStyle,
            rootContext,
            resourcePath,
            isProduction
        });
    }

    // operate the ast for move template into  script
    const sanScriptAst = require('./move-template-into-script')(webpackContext);
    const scriptStr = gen(sanScriptAst).code;

    output += scriptStr;
    if (!isProduction) {
        const hotId = shortFilePath;

        output += `
    if(module.hot){
        var hotApi = require('san-hot-reload-api')
                
        hotApi.install(require('san'), false)
        if(!hotApi.compatible){
            throw new Error('san-hot-reload-api is not compatible with the version of Vue you are using.')
        }
        module.hot.accept()
        var id = '${hotId}'
        var default = module.exports ? module.exports.default : module.__proto__.exports.default
        if(!module.hot.data) {
            hotApi.createRecord(id, default)
        }else{
            hotApi.reload(id, default)
        }
    }
    `;
    }
    return output;
};
