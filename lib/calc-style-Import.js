module.exports = function calceStyleImport({isProduction, webpackContext, sanStyle, rootContext, resourcePath}) {
    const styleLoader = isProduction
        ? `${rootContext}/node_modules/mini-css-extract-plugin/dist/loader.js`
        : 'style-loader';
    const cssLoader = 'css-loader?' + (webpackContext.query.cssLoader
        ? JSON.stringify(webpackContext.query.cssLoader).replace(/"/g, '\\"')
        : '\{sourceMap:true,importLoaders:1\}');
    const postcssLoader = 'postcss-loader?sourceMap=true';
    const stylusLoader = 'stylus-loader';
    return `import "!!${styleLoader}!${cssLoader}!${postcssLoader}!${
        sanStyle.attrs && sanStyle.attrs.lang === 'stylus'
            ? stylusLoader + '!'
            : ''
        }${rootContext}/node_modules/san-webpack-loader/lib/selector.js?type=style!${resourcePath}"\n`;
};
