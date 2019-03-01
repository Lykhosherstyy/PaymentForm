'use strict';
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const MiniCssExtractPlugin  = require('mini-css-extract-plugin');

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: resolve('node_modules'),
                use: 'babel-loader'
            },
            {
            test: /\.html$/,
                    use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(jpg|png|svg)$/,
                use: {
                    loader: "file-loader",
                }
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: `postcss-loader`,
                        options: {
                            config: {
                                path: __dirname + '/postcss.config.js'
                            }
                            // ident: 'postcss',
                            // plugins: [
                            //     autoprefixer({ browsers: [ 'last 2 versions' ] })
                            // ]
                        }
                    },
                    'sass-loader'

                ]
            }
        ]
    },
    optimization: {
        namedModules: true,
        namedChunks: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
        }),
        new CopyWebpackPlugin([{
            from: resolve('static'),
            to: resolve('dist/static'),
            toType: 'dir'
        }]),
        new MiniCssExtractPlugin({
            filename: 'main.css',
            // chunkFilename: "[id].css"
        }),
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery'
        // })
    ]
};