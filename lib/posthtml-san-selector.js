module.exports = function pluginName(options) {

    return function (tree) {
        // template.length 必须为1
        const template = tree.filter(obj => obj.tag === 'template');
        const styles = tree.filter(obj => obj.tag === 'style');
        // script.length <= 1
        let script = tree.filter(obj => obj.tag === 'script');

        if (template.length !== 1) {
            throw new Error(`
                🍩 san-webpack-loader only supports one template, detected:  ${template.length}
            `);

        }

        if (script.length === 0) {
            script.push(
                {
                    tag: "script",
                    content: [
                        "\nexport default {};\n"
                    ]
                });
        }
        else if (script.length > 1) {
            throw new Error(`
                🍩 san-webpack-loader only supports one script, detected:  ${script.length}
            `);
        }
        else if (styles.length > 2) {
            throw new Error(` 
                🍩 san-webpack-loader only supports 2 style, detected:  ${styles.length}
            `);
        }
        // 只把有用的东东挂到ast tree.messages上
        tree.messages.push(template[0], script[0], ...styles);
    };
};



