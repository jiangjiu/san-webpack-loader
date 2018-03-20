/**
 * @file add moduleId for every Component element
 * @author zhangsiyuan(zhangsiyuan@baidu.com)
 */



module.exports = function pluginName(options = {}) {
    const moduleId = options && options.moduleId;

    return function (tree) {
        if (moduleId) {
            // 借用一下tree的walk方法遍历template
            tree.walk.call(tree.messages.find(({tag}) => tag === 'template'), node => {
                if (node && node.tag && node.tag !== 'template') {
                    node.attrs = Object.assign(node.attrs ? node.attrs : {}, {
                        [`${moduleId}`]: true
                    });
                }
                return node;
            });
        }
    };
};


