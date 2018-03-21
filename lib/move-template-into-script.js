/**
 * @file move
 * @author zhangsiyuan(zhangsiyuan@baidu.com)
 */

const render = require('posthtml-render');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const t = require('@babel/types');

module.exports = function (tree) {
    const wrappedTemplateQuote = str => `\`${str}\``;
    const sanTemplateString = render(tree.messages.find(({tag}) => tag === 'template').content, {});
    // script标签解析成ast以供后续插入
    const sanScriptAst = babel.parse(tree.messages.find(({tag}) => tag === 'script').content[0], {
        sourceType: 'module'
        // san暂时还不支持异步组件
        // plugins: [ "@babel/plugin-syntax-dynamic-import" ]
    });
    // 将template转成objectProperty类型的模板字符串，move进入script中
    const templateLiteralAst = babel.parse(wrappedTemplateQuote(sanTemplateString))
        .program
        .body[0]
        .expression;
    const objectPropertyAst = t.objectProperty(
        t.identifier('template'),
        t.templateLiteral(templateLiteralAst.quasis, templateLiteralAst.expressions)
    );
    traverse(sanScriptAst, {
        enter(path) {
            if (path.node.type !== 'ExportDefaultDeclaration') {
                return;
            }
            path.node.declaration.properties.push(objectPropertyAst);
        }
    });

    return sanScriptAst;
};
