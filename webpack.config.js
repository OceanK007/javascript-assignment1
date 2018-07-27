const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = 
{
    entry: ['./src/js/index.js'],
    output: 
    {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    devtool: "source-map",
    module:
    {
        rules:
        [
            { 
                test: /\.js$/, 
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: 
                [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/
            },
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'eslint-loader',
                    options: {
                        fix: true
                    }
                  }
            }
        ]
    },
    plugins: 
    [
        new HtmlWebpackPlugin
        ({
            template: 'index.html'
        })
    ],
    mode: 'development'
};