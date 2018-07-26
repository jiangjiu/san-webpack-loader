/**
 * @file move
 * @author zhangsiyuan(zhangsiyuan@baidu.com)
 */

const render = require('posthtml-render');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const t = require('@babel/types');
module.exports = function (__sanParts__) {
    const wrappedTemplateQuote = str => `\`${str}\``;
    const sanTemplateString = render(__sanParts__.template[0].content, {});

    // script标签解析成ast以供后续插入
    const sanScriptAst = babel.parse(
        __sanParts__.script.content
        // 注释掉  因为babel内部做了升级scoped babelrc
        // {
        //     extends: './.babelrc'
        // }
    );
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
