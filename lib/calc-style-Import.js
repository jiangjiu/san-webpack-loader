const path = require('path');
const {resolve, join} = path.posix;

module.exports = function calceStyleImport({isProduction, webpackContext, sanStyle, rootContext, resourcePath}) {

    // 路径需要对windows环境区分处理，用path.posix处理，不然windows无法正常编译
    // linux系统确不能用，会导致绝对路径的开头斜杠失效
    if (/^win/.test(require('os').platform())) {
        rootContext = join(...rootContext.split(path.sep));
        resourcePath = join(...resourcePath.split(path.sep));
    }
    const sourceMap = isProduction ? 'false' : 'true';
    const styleLoader = isProduction
        ? `!${rootContext}/node_modules/mini-css-extract-plugin/dist/loader.js`
        : '!style-loader';
    const cssLoader = `!css-loader?\{sourceMap:${sourceMap},importLoaders:1\}`;

    const postcssLoader = `!postcss-loader?sourceMap=${sourceMap}`;
    
    const cssLoaderMap = {
        stylus: '!stylus-loader',
        less: '!less-loader'
    };

    const cssProcessorLoader = sanStyle.attrs && cssLoaderMap[sanStyle.attrs.lang] || '';

    // 拼接生成内联loader处理san样式
    const genStyleString = (...args) => {
        const startString = `import "!`;

        const endString =
            `!${rootContext}/node_modules/san-webpack-loader/lib/selector.js?type=style!${resourcePath}"\n`;

        return [
            startString,
            ...args,
            endString
        ].join('');
    };

    return genStyleString(styleLoader, cssLoader, postcssLoader, cssProcessorLoader);
};
