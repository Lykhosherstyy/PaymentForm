'use strict';
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const MiniCssExtractPlugin  = require('mini-css-extract-plugin');

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = {
    entry: {
        app: resolve('src/index.js')
    },
    mode: 'production',
    devtool: 'source-map',
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
                    options: {
                        outputPath: './../dist/static'
                    },
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: `postcss-loader`,
                        options: {
                            config: {
                                path: __dirname + '/postcss.config.js'
                            }
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            minify: {
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            }
        }),
        // new CopyWebpackPlugin([{
        //     from: resolve('static'),
        //     to: resolve('dist/static'),
        //     toType: 'dir'
        // }]),
        new MiniCssExtractPlugin({
            filename: 'main.min.css',
        }),
    ]
};