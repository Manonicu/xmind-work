const webpack = require("webpack");
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const ip = require('ip').address();
const open = require('open');
const chalk = require("chalk");

module.exports = merge(webpackBaseConfig, {
    mode: "development",
    devtool: "#source-map",
    devServer: {
        contentBase: "./static",
        historyApiFallback: true,
        host: ip,
        overlay: true,
        after() {
            open(`http://${ip}:${this.port}`)
                .then(() => {
                    console.log(chalk.cyan(`成功打开链接： http://${ip}:${this.port}`));
                })
                .catch(err => {
                    console.log(chalk.red(err));
                });
        }
    }
});