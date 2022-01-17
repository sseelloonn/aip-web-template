# Webpack5打包

目前`Webpack`版本为**5**，与之前`Grunt`工具类似，都是属于`前端工程打包`的工具。由于**MPA**的打包方式需要修改`Webpack`的配置，`create-react-app`脚手架封装的是**SPA**的应用，所以需要将其`弹出`为原始的`webpack`打包方式，以便支持**MPA**的打包。

~~~bash
npm run eject
~~~

> 注意: eject操作是不可逆的，弹出后，就不会恢复到`create-react-app`的默认配置方式，运行的命令也会从`react-scripts`改为默认的`node`

## 基本概念

打包工具分两个部分，`内核`和`CLI`，我们可以一次安装（如果是用`React脚手架`，会自动安装）

~~~typescript
yarn add webpack webpack-cli -D
~~~

配置主文件 `package.json`，细节配置文件为`webpack.config.js`，常用的配置包括

- devtool 配置是否生成，如何生成 source map
- entry 配置入口（可以有多个，SPA程序只有一个）
- output 配置输出
- module 配置模块，包括 `loader`的配置规则也在这里 `module.rules`
- resolve 配置模块如何解析
- plugins 配置插件，如 `HtmlWebpackPlugin`
- externals
- target 打包目标，如`web`或多个`[browserslist]` 
- mode  打包模式，如 `production`、`development`



一个标准的`webpack`标准配置脚本入口如下

~~~javascript
module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";
  return {
    target: ["browserslist"],
    ...
  };
}
~~~



更多配置部分说明，请参考文档 [https://webpack.docschina.org/configuration/](https://webpack.docschina.org/configuration/)

### Loader

`Loader`配置在 `module.rules`中，依靠名字匹配方式来处理文件（可以修改输出），每个`webpack`能处理的文件（从entry开始分析），都会交给适配的`loader`来处理。以下是常用的一些`loader`：

- 样式：style-loader、css-loader、less-loader、sass-loader

- 文件：raw-loader、file-loader 、url-loader

- 编译：babel-loader、coffee-loader 、ts-loader

- 校验测试：mocha-loader、jshint-loader 、eslint-loader

下例使用 `babel-loader` 来处理 `js`和`mjs`文件

~~~json
{
    test: /\.(js|mjs)$/,
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    loader: require.resolve("babel-loader"),
    options: { // 每个loader本身需要的个性化设置选项
        babelrc: false,
        configFile: false,
        compact: false,
        presets: [
            [
                require.resolve("babel-preset-react-app/dependencies"),
                { helpers: true },
            ],
        ],
        cacheDirectory: true,
        // See #6846 for context on why cacheCompression is disabled
        cacheCompression: false,

        // Babel sourcemaps are needed for debugging into node_modules
        // code.  Without the options below, debuggers like VSCode
        // show incorrect code and set breakpoints on the wrong lines.
        sourceMaps: shouldUseSourceMap,
        inputSourceMap: shouldUseSourceMap,
    }
}
~~~

这里简单说明一下一个`loader`的原型，以便大家理解：Loader关注的文件内容输入和输出

~~~typescript
module.exports = function(content: string, sourceMap: Map, meta: any) {
    let options = this.query.options;
    // return target content
}
~~~



### Plugins



这里也简单说一下一个`Plugin`的原型

~~~typescript
module.exports = class CustomWebpackPlugin {
 constructor(options) {
   this.options = options;
 }
 
 apply(compiler) {
   // 可以利用compiler对象获取到整改webpack的配置，注册事件监听的例程
   console.log("FROM CUSTOM PLUGIN");
 }
}
~~~

> Loader与Plugins的区别在于Loader是Webpack在处理文件时候调用转换的，而Plugins是响应Webpack生命周期各个事件的。Loader关注的文件的处理，输入内容，输出转换后的内容；而Plugin关注的某个事件触发后需要做什么，比如完成编译后，启动gzip打包或者混淆。当然，两者都是属于Webpack插件体系核心



`webpack-dev-server` 是 `Webpack`提供的**测试/开发环境**的`Web Server`，主要用于开发阶段的调试

~~~typescript
yarn add webpack-dev-server -D
~~~

配置如下:

~~~json
// webpack.config.js
module.exports = {
 // ...
 devServer: {
  historyApiFallback: true,
  contentBase: path.join(__dirname, './dist'),
  open: false,
  hot: true,
  quiet: true,
  port: 8082,
 },
}
~~~

在 `package.json` 里面设置`启动入口`

~~~json
// package.json
{
 "scripts": {
  "start": "webpack serve"
 }
}
~~~

## MPA打包改造部分

由于`create-react-app`脚手架是封装过之后的打包构建工具，所以看不到`webpack`相关的配置（都是使用生成`SPA` 的默认配置），如果要改造成`MPA`打包方式，我们需要修改，使用命令将原始的`webpack`配置信息弹出来以便我们修改。

~~~bash
# 弹出,不可逆操作
npm run eject
~~~

弹出配置后，我们就可以通过修改相关的配置来完成`MPA`程序的构建。

#### 增加入口

这里需要明确的是`SPA`有一个入口，`MPA`有多个入口

~~~javascript
// entry: paths.appIndexJs, // 原来的单入口
entry: { // 改为多个入口，每个入口生成一个chunk
    index: paths.appIndexJs,
        appFrame: paths.appFrameJs,
},
~~~

#### 增加输出

每个入口被`webpack`分析后，会生成对应的**资源**文件（如css、js等），那么还需要多个`html`文件来显示这些入口（其实每组对应的资源，都是挂载到不同的`html`页面上的），所以这里需要在`plugins`中增加一个入口`html`生成配置

~~~javascript
new HtmlWebpackPlugin(
    Object.assign(
        {},
        {
            inject: true, // 资源会自动插入到页面中
            template: paths.appHtml, // html模板文件
            chunks: ["index"], // 对应chunk入口，在entry中已经定了入口chunk
        },
        isEnvProduction
        ? {
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }
        : undefined
    )
),
  
// 新增的iframe入口html打包
new HtmlWebpackPlugin(
    Object.assign(
        {},
        {
            inject: true,
            template: paths.appFrameHtml,
            chunks: ["appFrame"],
            filename: "iframe.html", // 输出为iframe.html文件，如果没有设置，默认为index.html
        },
        isEnvProduction
        ? {
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }
        : undefined
    )
),
~~~

#### 修改一处代码

由于从单入口变为多入口，有一个地方代码需要修改以适配这种情况

~~~javascript
new WebpackManifestPlugin({
    fileName: "asset-manifest.json",
    publicPath: paths.publicUrlOrPath,
    generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
        }, seed);
        // 原来的单入口逻辑，如果在多入口情况下，entrypoints.main不存在main，所以会报错
        // const entrypointFiles = entrypoints.main.filter(
        //   (fileName) => !fileName.endsWith(".map")
        // );
        const entrypointFiles = {};
        // 改为遍历方式就安全了
        Object.keys(entrypoints).forEach(entrypoint => {
            entrypointFiles[entrypoint] = entrypoints[entrypoint].filter(fileName => !fileName.endsWith('.map'));
        });
        return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
        };
    },
}),
~~~

#### 输出部分的修改

由于多入口，所以必须将原有单入口的命名修改，以保证多入口的`chunk`都能准确找到资源，这个时候命名加入`[id]`比只使用`[name]`要更好，作出如下修改

~~~javascript
output: {
      // The build folder.
      path: paths.appBuild,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isEnvDevelopment,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: isEnvProduction
        ? "static/js/[id][name].[contenthash:8].js" // 加入id
        : isEnvDevelopment && "static/js/[id]bundle.js", // 加入id
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isEnvProduction
        ? "static/js/[id][name].[contenthash:8].chunk.js" // 加入id
        : isEnvDevelopment && "static/js/[id][name].chunk.js", // 加入id
      assetModuleFilename: "static/media/[id][name].[hash][ext]", // 加入id
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: paths.publicUrlOrPath,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: isEnvProduction
        ? (info) =>
            path
              .relative(paths.appSrc, info.absoluteResourcePath)
              .replace(/\\/g, "/")
        : isEnvDevelopment &&
          ((info) =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")),
    },
~~~

