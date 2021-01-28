const webpack = require("webpack");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {merge} = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');

module.exports = merge(webpackBaseConfig, {
    mode: "production",
    externals: {
        vue: "Vue",
        axios: "axios",
        iview: "iview"
    },
    plugins: [
        // new BundleAnalyzerPlugin()
    ]
});
