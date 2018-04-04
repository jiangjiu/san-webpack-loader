const posthtml = require('posthtml');

module.exports = function (content) {
    const webpackContext = this;
    posthtml([
        require('./posthtml-san-selector')({webpackContext})

    ]).process(content, {
        sync: true
    });

    return this._compilation.__sanParts__.style[0].content[0];
};
