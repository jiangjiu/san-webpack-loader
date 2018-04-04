/**
 * @file add moduleId for every Component element
 * @author zhangsiyuan(zhangsiyuan@baidu.com)
 */

module.exports = function pluginName({webpackContext}) {
    return function (tree) {
        const sanTemplateAst = webpackContext._compilation.__sanParts__.template;
        // 借用一下tree的walk方法遍历template
        process.env.NODE_ENV === 'production' && tree.walk.call(sanTemplateAst, node => {
            node && typeof node === 'string' && (node = node.replace(/\n\s*/g, ''));
            return node;
        });
    };
};


