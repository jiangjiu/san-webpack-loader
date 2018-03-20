module.exports = function pluginName(options) {

    return function (tree) {
        // template.length 必须为1
        const template = tree.filter(obj => obj.tag === 'template');
        if (template.length !== 1) {
            throw new Error(`san-webpack-loader only support one template, detected:  ${template.length}`);

        }

        // script.length <= 1
        let script = tree.filter(obj => obj.tag === 'script');
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
            throw new Error(`san-webpack-loader only support one script, detected:  ${script.length}`);
        }
        const styles = tree.filter(obj => obj.tag === 'style');

        // 只把有用的东东挂到ast tree上
        tree.messages.push(template[0], script[0], ...styles);
    };
};



