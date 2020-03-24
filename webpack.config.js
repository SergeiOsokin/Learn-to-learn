const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    //main js
    entry: { main: './index.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [{// пример настройки плагина image-webpack-loader
            test: /\.(png|jpg|gif|ico|svg)$/,
            use: [
                'file-loader?name=./images/[name].[ext]', // указали папку, куда складывать изображения
                {
                    loader: 'image-webpack-loader',
                    options: {}
                },
            ]
        },
        {
            test: /\.css$/i,
            use: [
                (isDev ? 'style-loader' : MiniCssExtractPlugin.loader),
                'css-loader',
                'postcss-loader'
            ]
        },
        {//шрифты
            test: /\.(eot|ttf|woff|woff2)$/,
            loader: 'file-loader?name=./vendor/[name].[ext]'
        }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default'],
            },
            canPrint: true
        }),
         new HtmlWebpackPlugin({
            inject: false, // стили НЕ нужно прописывать внутри тегов
            template: './index.html', // откуда брать образец для сравнения с текущим видом проекта
            filename: 'index.html' // имя выходного файла, то есть того, что окажется в папке dist после сборки
         }),
        new WebpackMd5Hash(),
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
    ],


}
