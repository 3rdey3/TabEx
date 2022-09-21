const path = require('path');
const { env } = require('process');

module.exports = (env) => {
    return {
        mode: env.production ? 'production' : 'development',
        devtool: "source-map",
        entry: {
            popup: './popup/Popup.tsx', // here's your react file
            option: './option/Options.tsx',
        },
        output: {
            // devtoolLineToLine: true,
            sourceMapFilename: '[name].bundle.js.map',
            pathinfo: true,
            filename: '[name].bundle.js',
            // this is your output folder
            path: path.resolve(__dirname, 'dist'),
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json']
        },
        watchOptions: {
            ignored: ['**/node_modules', '**/dist']
        },
        module: {
            rules: [
                {
                    test: /\.ts(x)?$/, // turn all jsx into commonjs
                    use: 'babel-loader', // using this loader
                    exclude: [/node_modules/, /dist/],
                },
            ],
        },
    }
};