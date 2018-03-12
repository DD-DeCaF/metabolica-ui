const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                })
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                include: [path.resolve(__dirname, 'src')],
                options: {
                    transpileOnly: false,
                    compilerOptions: {
                        isolatedModules: true
                    }
                }
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                include: [path.resolve(__dirname, 'src')],
                loader: 'eslint-loader',
                options: {
                    failOnError: true
                }
            },
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src')],
                loader: 'babel-loader',
            },
            {
                test: /\.html$/,
                include: [path.resolve(__dirname, 'src')],
                loader: 'html-loader',
                query: {
                    minimize: true
                }
            },
            {
                test: /\.(jpe?g|png|svg)$/,
                include: [path.resolve(__dirname, 'img')],
                loader: 'file-loader?name=[path][name].[ext]'
            }
        ]
    }
};
