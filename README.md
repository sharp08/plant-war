# Webpack4 通用基础模板配置
***
- 安装依赖
```
npm i
```
- 启动服务
```
npm run serve 
```
- 服务地址 & 打包分析地址
```
localhost:10240
127.0.0.1:12031
```
- 打包
```
npm run build
```

***
1. 不同环境配置文件分离，使用 `webpack-merge` 合并
2. 使用 `webpack-dev-server` 启动服务，标注了启用外部工程的方法并在根目录下准备了 `other-project` 测试
3. 预留了 `library` 时的 `umd` 规范写法
4. `treeshaking` 效果，由于 `lodash` 不支持 `treeshaking`， 准备了 `lodash-es` 用于测试效果
5. `lazy-load` 效果
6. 启用代码分离 `optimization.splitChunks`
7. 准备了 `babel` 相关的插件共 7 个，其中，并在 `.babelrc` 中做了相应的配置
8. 打包分析 `webpack-bundle-analyzer`，自动生成模板 `html-webpack-plugin`，清理文件夹`clean-webpack-plugin`
9. 预留了定义全局变量的 `webpack.DefinePlugin` 
10. 预留了全局导入模块的 `webpack.ProvidePlugin` 及 `treeshaking` 写法
