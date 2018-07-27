/**
 * @file loader
 * @author zhangsiyuan(zhangsiyuan@baidu.com)
 */
const path = require('path');
const posthtml = require('posthtml');
const gen = require('@babel/generator').default;
const isProduction = process.env.NODE_ENV === 'production';

module.exports = function (content) {
    const callback = this.async();
    const {
        rootContext = process.cwd(),
        resourcePath
    } = this;
    let output = '';
    const webpackContext = this;

    const shortFilePath = path.relative(rootContext, resourcePath).replace(/^(\.\.[\\\/])+/, '');

    const __sanParts__ = posthtml([
        // separate script、template、style
        require('./posthtml-san-selector')(),
        // optimize size
        require('./posthtml-remove-indent')()

    ]).process(content, {
        // almost gave up
        // shit@ post html docs
        recognizeSelfClosing: true,
        sync: true
    }).tree.messages[0];
    // <style> exists
    const sanStyle = __sanParts__.style;
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
    const sanScriptAst = require('./move-template-into-script')(__sanParts__);
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
        var moduleDefault = module.exports ? module.exports.default : module.__proto__.exports.default
        if(!module.hot.data) {
            hotApi.createRecord(id, moduleDefault)
        }else{
            hotApi.reload(id, moduleDefault)
        }
    }
    `;
    }
    callback(null, output);
};
