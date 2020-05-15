const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(process.cwd(), "static"),
        publicPath: "",
        filename: "build.js"
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    priority: 1, //添加权重
                    test: /node_modules/, //把这个目录下符合下面几个条件的库抽离出来
                    chunks: 'initial', //刚开始就要抽离
                    minChunks: 2 //重复2次使用的时候需要抽离出来
                },
                common: {
                    //公共的模块
                    chunks: 'initial',
                    minChunks: 2
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            }
        },
        minimize: true
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            loaders: {
                                less: [
                                    MiniCssExtractPlugin.loader,
                                    "css-loader",
                                    "vue-style-loader"
                                ],
                                css: [
                                    MiniCssExtractPlugin.loader,
                                    "css-loader",
                                    "vue-style-loader"
                                ]
                            }
                        }
                    },
                    {
                        loader: 'iview-loader',
                        options: {
                            prefix: false
                        }
                    }
                ]
            },
            {
                test: /iview\/.*?js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    // "style-loader"
                ]
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=1024'
            },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new HtmlWebpackPlugin({
            title: "XMind",
            template: "./index.html"
        }),
        new VueLoaderPlugin(),
    ],
};