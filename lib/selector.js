/**
 * @file select the right type in runtime
 * @author zhangsiyuan(zhangsiyuan@baidu.com)
 */

const loaderUtils = require('loader-utils');
const posthtml = require('posthtml');

module.exports = function (content) {
    const options = loaderUtils.getOptions(this) || {};
    const webpackContext = this;
    
    posthtml([
        require('./posthtml-san-selector')({webpackContext})

    ]).process(content, {
        sync: true
    });

    return this._compilation.__sanParts__[options.type].content;
};
