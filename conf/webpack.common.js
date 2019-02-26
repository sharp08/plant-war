const path = require("path")            //  路径插件
const webpack = require("webpack")
const CleanWebpackPlugin = require("clean-webpack-plugin")      //  用于清空指定文件夹
const HtmlWebpackPlugin = require("html-webpack-plugin")        //  生成模板 index.html
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;   //  打包分析插件


function resolve(src) {
    return path.resolve(__dirname, src)
}

module.exports = {
    entry: {
        app: resolve('../src/index.js'),
        // print: resolve('../src/js/print.js')
    },
    output: {
        filename: "[name].bundle.js",
        chunkFilename: '[name].chunk.[chunkhash].js',
        path: resolve("../dist"),
        // library: "myModule",     //  打包后暴露出的名字  window.myModule
        // libraryTarget: "umd"     //  按照 umd 规范打包，即同时支持 CommonJS，AMD，CMD，ES6 和 全局引用
    },
    devServer: {
        // contentBase: resolve("../other-project"),  //  如果需要启动一个外部项目，这里是目录地址，默认启动 abc/index.html，需要关闭 html-webpack-plugin 插件
        // index: 'index.html',    //  这里与 HtmlWebpackPlugin 中 filename 对应，默认入口页
        port: 10240,
        overlay: true
    },
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|bmp)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 2000        //  单位 byte
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    resolve: {
        alias: {
            "@js": resolve("../src/js"),     //  别名
            "@images": resolve("../src/images"),     //  别名
            "@css": resolve("../src/css"),     //  别名
        },
        extensions: ['.js','.jpg','.png']       //  可省略扩展名
    },
    optimization: {
        //  用于提取公共部分，形成 chunk
        splitChunks: {
            chunks: 'all'
        },
        // minimize: false     //  打包时不压缩代码
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerHost: '127.0.0.1',
            analyzerPort: 12031,
            openAnalyzer: false
        }),
        new HtmlWebpackPlugin({
            title: "测试 html-webpack-plugin",
            filename: "index.html", //  打包后输出的文件名
            template: resolve('../template.html')   //  打包参照的模板，不配置这一项就自动生成
        }),
        new CleanWebpackPlugin(['dist'], {
            root: resolve('../')
        }),
        // new webpack.ProvidePlugin({
        //     _join: "lodash-es/join"     //  treeshaking 写法,开发生产都有效
        // })
    ]
}