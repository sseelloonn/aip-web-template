# AMIS代码研读

## 体系架构

先理解`amis`框架 **源码** 的结构比较重要，如下说明各个文件夹的作用

`scripts` 构建脚本，包括markdown转译，CDN发布，合并打包，构建schema文件等

`examples` 在线演示的web主体，提供给使用人员一个说明 `组件`功能的在线体验web

`docs` 在线帮助的 **markdown** 文档

`src` 组件源码文件夹📂，再细分说明一下该文件夹内部的组织形式

​	`components` 组件，内部包含各个前端组件 `type` 定义的组件源码

​	`hooks` 常用的 `hook` 定义

​	`icons` 组件使用到的 `svg`图标集合

​	`locale` 多语言定义文件，采用 `语言-国别`形式来定义，如： `zh-CN.ts`

​	`renderers` 渲染器源码，提供接口(schema)定义及组件想框架 `注册`，这是前端展现组件的 **实体**

​	`store` 前端缓存及组件间数据共享支持，内部采用 **mobx** 来实现

​	`themes` 皮肤定义和注册

​	`uttils` 工具集合，各种工具函数和类（如 `buildApi`、`tpl`处理等）

这里需要理解为什么组件分别用`components` 和 `renderers` 两个目录来组织，在 `components`中是组件的代码，可以有很多组件（多个版本或多种实现），可以认为是 `plain components`，你可以在这里放置各个框架的组件代码(比如`antd`,`tinper`等库的组件)，而 `renderers`目录组织的是注册的组件（对外公布的组件），是 `amis`公开出来的组件，大部分情况两者都是 `一一对应`关系，由 `renderers`中组件做一个简单处理直接调用 `components`中相应的组件（所以`type`属性必须唯一）。如

~~~typescript
@Renderer({
  type: 'alert'
})
export class TplRenderer extends React.Component<AlertProps & RendererProps> {
  render() {
    const {render, body, ...rest} = this.props;
    return <Alert {...rest}>{render('body', body)}</Alert>; // 直接交给 components/Alert.tsx 渲染
  }
}
~~~

这样做的好处是对外暴露组件与原始组件有一个映射关系可以配置及调整，便于后续替换组件（思路请参考设计模式中的 **Proxy** 模式或 **Adapter** 模式）。

 `components`的组件还是可以在 `react`中作为 **UI**库组件直接使用，但不能在`schema`中直接定义使用，这是两者之间的区别。



### 整体结构

`AMIS`的仓库[https://github.com/baidu/amis](https://github.com/baidu/amis) 其实是一个综合性的项目，包括 `源码` `文档` `演示系统` 三大部分，提供一个 `开源框架库` 全部的功能，其中 `docs`提供了文档说明，通过 `marked` 库将 `markdown`文档直接转为`html`展示给客户，而`examles`提供了 `组件`演示部分的功能。在做 `审友UI库` 的时候，会直接采用 `AMIS`的仓库架构，在其上更改补充，做到整个仓库在提供 `SDK` 的同时也能面向 `研发人员` ，给予其文档支持。



## 依赖环境

开发环境的各个依赖版本比较重要，需要特别注意，以下是**推荐**的各个主要依赖的版本号，为了不出现各种意想不到的问题（浪费排查时间），建议按照推荐版本号配置开发环境。

- React

   ^16.8.6  **特别提醒** 由于hook处理不太一样，不能使用新版本（如：`^17.0.2`）

- amis

  ^1.6.0  截止目前的版本，如果是小版本，可以从内网机器安装（包含审友UI元素）

- TypeScript

  ^4.5.4 

  一个简单的 `package.json` 依赖配置示例

  ~~~json
  {
    "name": "aip-web-template",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
      "@testing-library/jest-dom": "^5.16.1",
      "@testing-library/react": "^12.1.2",
      "@testing-library/user-event": "^13.5.0",
      "@types/jest": "^27.4.0",
      "@types/node": "^16.11.19",
      "@types/react": "^16.8.25",
      "@types/react-dom": "^17.0.11",
      "amis": "^1.6.0",
      "react": "^16.8.6",
      "react-dom": "^16.8.6",
      "react-router": "^6.2.1",
      "react-scripts": "5.0.0",
      "typescript": "^4.5.4",
      "web-vitals": "^2.1.2"
    },
    "scripts": {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
    },
    "eslintConfig": {
      "extends": [
        "react-app",
        "react-app/jest"
      ]
    },
    "browserslist": {
      "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
      ],
      "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ]
    },
    "devDependencies": {
      "@types/react-router": "^5.1.17"
    }
  }
  
  ~~~

  



----

以下文档都是按照实际代码阅读的时候出现的 **问题** 以探究方式来组织的，没有成`体系`，但读完应该能有所收获。 



## 注册组件

注册到`amis`的组件（可以用 `schema` 定义）均在 `renderers`中，一个示例代码如下

~~~typescript
@Renderer({
  type: "version"
})
export default class Version extends React.Component<RendererProps, {}> {
  render() {
    return (
    	<h1>审友A76组件库</h1>
    );
  }
}
~~~

然后在 `src/index.tsx` 中导入组件完成组件注册

~~~typescript
import './renderers/Version'; 
~~~



`@Renderer`注解是一个 **高阶函数** ，提供一个`注解`来快速完成部分封装功能，注意，`JavaScript`的注解是 `ES6`提案（`Babel 7.1.0`已经支持最新提案，`TypeScript` 1.5版本之后就已经支持注解方案），虽然还未之后确定，但能使用，与`python`的注解基本相同。

~~~typescript
export function Renderer(config: RendererBasicConfig) {
  return function <T extends RendererComponent>(component: T): T {
    const renderer = registerRenderer({
      ...config,
      component: component
    });
    return renderer.component as T;
  };
}
~~~

其实真实的调用模式可以如下：

~~~javascript
export Renderer(config)(Version)
~~~

内部调用 `registerRender`函数进行组件注册（并返回原始组件）。



~~~typescript
SchemaRenderer 作为schema的 render 解析
~~~

### @autobind 函数

这里用到 `@Renderer`注解函数，也顺便说一下另外一个注解函数 `@autobind`函数，来自 `helper.tsx`的帮助函数，其实是 `autobindMethod`函数的别名，其作用是：绑定 `this`对象并给对象提供对应名称属性读写能力，核心代码：

~~~typescript
get: {
  ...
	const boundFn = bind(fn, this);
  defineProperty(this, key, {
    configurable: true,
    writable: true,
    // NOT enumerable when it's a bound method
    enumerable: false,
    value: boundFn
   });

   return boundFn;
 },
 set: createDefaultSetter(key)
~~~

这个函数应用于 `React对象事件方法`可以更方便完成绑定逻辑，如：

~~~typescript
@autobind
renderMenu(option: Option, state: any) {
  const {menuTpl, render, data} = this.props;
  return render(`menu/${state.index}`, menuTpl, {
    data: createObject(createObject(data, state), option)
  });
}
... 
// 使用时
renderMenu={menuTpl ? this.renderMenu : undefined}
~~~

这个简单的绑定函数在组件开发的时候可以使用（仅限于 `审友UI` 框架环境）。



## 组件库打包

采用 **FIS3** 进行打包（来自百度的前端构建框架），该工具功能比较强大，采用 `pipline` 方式配置，编写 `各阶段`处理逻辑即可。

完整的 **FIS3** 帮助资料可以参考文档 [http://fis.baidu.com/fis3/docs/beginning/intro.html](http://fis.baidu.com/fis3/docs/beginning/intro.html) 或 [https://www.bookstack.cn/read/fis3/README.md](https://www.bookstack.cn/read/fis3/README.md)

如果要理解 `amis` 整个打包过程，还是需要简单了解 **FIS3**前端构建工具，配置文件为 `fis-config.js`文件中

`FIS3`可以参与和修改构建全流程，提供了极大的可定制性。其他项目/产品也可以引入其作为前端构建工具！

## 组件启动

### SDK启动方式

通过引入 `sdk.js` 脚本方式引入`const amisLib = amisRequire("amis")`

然后导入 `schema` 定义（可以直接定义，也可以来自网络请求）

~~~typescript
amisLib.embed("dom-selector", json-schema, props, env)
~~~

`embed`就是导入 `JSON-Schema`的**引擎**，通过分析`embed`方法源码，可以知道最后还是通过调用 `embed.tsx`中的导出方法，核心代码如下

~~~typescript
renderReact(createElements(props), container); //container对应"dom-selector"参数
内部调用:
 {renderAmis(schema, amisProps, amisEnv)}
 最后调用 renderAmis (fectory.tsx -> render)
~~~

所以我们自己也可以封装一个 `renderPreview` 方法暴露给`amis`对象，可以即时显示给定 `json-schema`的展示效果

~~~typescript
import { render } from './factory'; // 预览函数直接调用 factory->render方法来获取解析后的组件

function renderPreview(domSelector: string | HTMLElement, schema: Schema) {
  let selector: HTMLElement;
  if (typeof domSelector === 'string') {
    selector = document.querySelector(domSelector) as HTMLElement;
  } else {
    selector = domSelector;
  }
  let comp = render(schema); // 获取schema生成的组件
  ReactDOM.render(comp, selector); // 渲染出来
}
~~~

绑定到`amis`对象后，该方法随时可以调用以在某个`DOM`节点显示效果（其实`amis`组件网站的在线测试功能就是采用此方式，只是没有暴露该方法）。



### 如何绑定到 `amis`对象上？

需要在 `src/index.tsx` 里面注册即可绑定到 `amis` 对象上，因为 `src/index.tsx` 会直接导出为 `amis`，代码示例如下：

~~~typescript
import { Schema } from './types';
import ReactDOM from 'react-dom';
function renderPreview(domSelector: string | HTMLElement, schema: Schema) {
  let selector: HTMLElement;
  if (typeof domSelector === 'string') {
    selector = document.querySelector(domSelector) as HTMLElement;
  } else {
    selector = domSelector;
  }
  let comp = render(schema);
  ReactDOM.render(comp, selector);
}

export * from './components/index';

export {
  renderPreview, // add to binds
  render,
  clearStoresCache,
  updateEnv,
~~~

在浏览器 `console` 中输入以下代码可以测试

~~~typescript
let amisLib = amis.require('src/index.tsx');
amisLib.renderPreview(".Doc-title", 
{
  type: 'page',
  title: '表单页面',
  body: [
    {
      type: 'form',
      mode: 'horizontal',
      onFinished: values => {
        console.log('form', values);
        return false; // 这样可以禁掉 amis 后续的默认行为
      },
      body: [
        {
          label: 'Name',
          type: 'input-text',
          name: 'name',
          onChange: value => {
            console.log('Name', value);
          }
        },
        {
          type: 'button',
          label: '按钮修改',
          onClick: (e, props) => {
            console.log('消息通知');
            props.formStore.setValues({name: 'amis'});
          }
        }
      ]
    }
  ]
}
);
~~~



## 关于Fetcher

`AMIS	`对于网络请求，采用注册 `Fetcher`的方式来注入自定义的`Ajax`请求组件和逻辑，默认的 `Fetcher`采用`axios`来实现，核心代码（embed.tsx）如下

~~~typescript
let response = await axios(config);
response = await attachmentAdpator(response, __);
response = responseAdaptor(api)(response);
~~~

这样做的好处是可以统一请求，如 wsFetcher、jsonpFetcher等不同的请求逻辑都统一到 `fetcher`这单一的概念上来。



## 关于多语言支持

`AMIS`组件在编写的时候就应该考虑 `多语言支持`需求，组件在 `props.locale`属性中会包含语言表达式 `语言-国别`，核心代码(`fectory.tsx` `render`函数)如下

~~~typescript
let defaultLocale: string = 'zh-CN';
...
let locale = props.locale || getDefaultLocale();
// 兼容 locale 的不同写法
locale = locale.replace('_', '-');
locale = locale === 'en' ? 'en-US' : locale;
locale = locale === 'zh' ? 'zh-CN' : locale;
locale = locale === 'cn' ? 'zh-CN' : locale;
const translate = props.translate || makeTranslator(locale);

...

return (
    <EnvContext.Provider value={env}>
      <ScopedRootRenderer
        {...props}
        schema={schema}
        pathPrefix={pathPrefix}
        rootStore={store}
        env={env}
        theme={theme}
        locale={locale}
        translate={translate} // 注入到props中
      />
    </EnvContext.Provider>
  );

~~~

可以看到 `props`属性中可以包含 `locale`属性字符串和`translate`函数，如果没有 `locale`属性，默认是 `zh-CN`，而 `makeTranslator`函数是默认的构造多语言定义文件解析器。

注册`locale`资源都是在响应的 `ts`文件中完成，如注册 `en-US`的`en-US.ts`核心代码如下（示例文件 `locale/en-US.ts`）

~~~typescript
mport {register} from '../locale';

register('en-US', {
  'Action.countDown': 'Wait for ${timeLeft}s',
  'Alert.info': 'System Info',
  'App.home': 'Home',
  'App.navigation': 'Navigation',
~~~

其实 `register`函数主要就是把对应项目放到 `locales`静态对象中。

~~~javascript
export function register(name: string, config: LocaleConfig) {
  locales[name] = config;
}
~~~

单独注册翻译项：

~~~typescript
let amisLib = amisRequire('amis');
amisLib.registerLocale('jp', {
  'Form.submit': '送信'
});
~~~

在组件中如果需要组件显示文本支持多语言，需要如下处理：

~~~typescript
render() {
    const {
      container,
      cancelText,
      confirmText,
      title,
      confirmBtnLevel,
      alertBtnLevel,
      classnames: cx
    } = this.props;
    let theme = this.props.theme || 'cxd';
    if (theme === 'default') {
      theme = 'cxd';
    }
    const __ = this.props.translate;
    const finalTitle = __(this.state.title ?? title);
    const finalConfirmText = __(this.state.confirmText ?? confirmText);
~~~

## 关于themes

`多语言`和`多主题`是 **现代UI**必不可少的特性，`多主题`提供了统一更改**UI**外观的便捷修改和自定义能力。`AMIS`的`多主题`能力与`多语言`能力一样强大和**简单**，可以将其他主题，如`tinper`样式设置到`AMIS`中来。

在`themes`目录中，目前有`antd.ts`，`ang.ts`，`cxd.ts`，`dark.ts`，`default.ts`几个主题，其实主题设置非常简单，都是通过`class前缀`来定义不同的样式类，如 `antd.ts`全部源码：

~~~typescript
import {theme} from '../theme';

theme('antd', {
  classPrefix: 'antd-',
  components: {
    toast: {
      closeButton: true
    }
  },

  renderers: {
    'form': {
      horizontal: {
        leftFixed: true
      }
    },

    'pagination': {
      maxButtons: 9,
      showPageInput: false
    },

    'fieldset': {
      collapsable: false
    },

    'remark': {
      placement: 'right'
    },

    'tabs': {
      mode: 'line'
    },

    'tabs-control': {
      mode: 'line'
    },

    'range-control': {
      showInput: true,
      clearable: true
    }
  }
});

~~~

源码中还对部分组件属性做了`默认设置`以达到该主题的显示效果。

而关键的 `theme`函数其实与`多语言`中`register`函数是一样的😸，给全局 `themes`变量赋值。

切换主题只要更新 `props.theme`属性即可完成组件重绘。而重绘的样式来自不同的 `css` 文件（通过样式类名）。

在前端`amis`这样引入**主题**（有点费网络资源）

~~~javascript
document.write(
  `<link rel="stylesheet" title="ang" ${
  theme !== 'ang' ? 'disabled' : ''
  }  href="${__uri('../scss/themes/ang.scss')}" />`
);
document.write(
  `<link rel="stylesheet" title="cxd" ${
  theme !== 'cxd' ? 'disabled' : ''
  } href="${__uri('../scss/themes/cxd.scss')}" />`
);
document.write(
  `<link rel="stylesheet" title="dark" ${
  theme !== 'dark' ? 'disabled' : ''
  } href="${__uri('../scss/themes/dark.scss')}" />`
);
document.write(
  `<link rel="stylesheet" title="antd" ${
  theme !== 'antd' ? 'disabled' : ''
  } href="${__uri('../scss/themes/antd.scss')}" />`
);
~~~



## `MD` 文档转 `html` 页面

**FIS3** 中处理 `md`文档转换为 `html`的节点为match `/docs/**.md`的时候调用 `parserMarkdown`方法进行解析。

~~~typescript
ghPages.match('/docs/**.md', {
    rExt: 'js',
    isMod: true,
    useHash: true,
    parser: [
      parserMarkdown, // 这是由单独的脚本完成 scripts/md-parser.js 来处理
~~~

实际生成各个组件都是从编译后js载入的，如代码：

~~~typescript
export const components = [
  {
    label: '布局',
    children: [
      {
        label: '组件介绍',
        path: '/zh-CN/components/index',
        getComponent: () =>
          import('../../docs/zh-CN/components/index.md').then(
            makeMarkdownRenderer // 核心解析器，直接使用了 marked 库进行解析
          )
      },
~~~

所以在更新文档的时候，还需要处理 `examples\components\Components.tsx` 中的定义（中文版定义文件 `examples\components\DocNavCN.ts`），加入其中（包含路由、组件、标签等信息）。MD解析的核心代码在 `examples\components\MdRenderer.tsx`。

在实际使用过程中，载入的 `json` 对象都是由 `marked` 生成的（在编译阶段就完成了md-parse过程），内部包含 `html` 片段。

> 这里需要**注意**的是，由于处理逻辑 `md-parser.js` 是基于 `正则表达式` 的匹配方式处理部分 `Markdown` 格式，所以，在 **Windows**环境编写的 **MD**文件需要用 `dos2unix` 工具进行转换，然后才能正常编译为目标 `js` 文件

这里需要关注的是 `examples` 网站本身就是用 `amis` 的元素构建出来的一个 *现代* 的网站，很多东西都可以参考甚至直接拿来用。网站本身有两种风格，一种是 `docs` 文档风格，一种是 `component` 演示的门户风格。这部分抽取出来单独做了一个`UI`（支持 `SPA`和`MPA`模式 - 可以切换分支查看） ，可以大幅度简化开发，提交到 `github` 上，有兴趣可以查看：[https://github.com/tufeiping/aip-web-template](https://github.com/tufeiping/aip-web-template)



## mod.js与sdk.js的关系

在演示系统(examles)代码中，启动演示前端UI的代码如下:

~~~html
<body>
    <div id="root" class="app-wrapper"></div>
    <script src="./mod.js"></script>
    <script type="text/javascript">
      /* @require ./index.jsx 标记为同步依赖，提前加载 */
      amis.require(['./index.jsx'], function (app) {
        var initialState = {};
        app.bootstrap(document.getElementById('root'), initialState);
      });
    </script>
  </body>
~~~

这里使用了 `mod.js`，而正式环境中使用的是 `sdk.js`，两者能使用的对象基本上一致，两者有什么关系呢？

其实 `sdk.js`是在`mod.js`的后面将所有依赖都打包到一起的一个大的`js`文件，便于生产环境部署和传输（传输一次），这个从 `fis-config.js`配置脚本就能看出来。

~~~javascript
env.match('::package', {
    packager: fis.plugin('deps-pack', {
      'sdk.js': [
        'examples/mod.js',
        'examples/embed.tsx',
        'examples/embed.tsx:deps',
        'examples/loadMonacoEditor.ts',
        '!mpegts.js/**',
~~~

将 `mod.js`放在最前面，后面接入所有的依赖文件，最后形成 `sdk.js`文件。

`mod.js`主要是为了调试期和演示组件功能场景使用的，生成环境请使用 `sdk.js`作为发布版，不要发布内部演示版本的文件。

生产环境使用 `amis`的方式

~~~html
<body>
  <div id="root" class="app-wrapper"></div>
  <script src="sdk.js"></script>
  <script type="text/javascript">
    (function () {
      let amis = amisRequire('amis/embed');
      // 通过替换下面这个配置来生成不同页面
      let amisJSON = {
        type: 'page',
        title: '表单页面',
        body: {
          type: 'form',
          mode: 'horizontal',
          api: '/saveForm',
          body: [
            {
              label: 'Name',
              type: 'input-text',
              name: 'name'
            },
            {
              label: 'Email',
              type: 'input-email',
              name: 'email'
            }
          ]
        }
      };
      let amisScoped = amis.embed('#root', amisJSON);
    })();
  </script>
</body>
~~~



*amisScoped* 对象在离开路由的时候可以使用 `amisScoped.unmount()`销毁实例，`amisScoped`还有很多有用的方法：`updateProps`，`getComponentByName`等。



## 如何做到示例Web系统的所见所得

首先在体验上，Web系统采用了组件 `Manoca-Editor` 来编写组件 `JSON-Schema` ，给出的渲染效果非常好（很接近 **IDE** 的效果），然后页面中有一个 `DIV` 专门负责渲染 `组件运行期` 效果。

实际实现过程稍微有点绕，但核心调用方式可以参考 [SDK启动方式](### SDK启动方式) 一节。



## 如何扩展AMIS体系

**审友UI库**在设计的时候，采取了 **“包含集成”** 而非 **“修改扩展”** 方式来基于`amis`扩展形成**审友UI库**（为了后续可以跟随 `amis`  升级，也可以快速替换为其他组件库实现），形成 `amis` 作为 **审友UI** 一个实现（目前是默认实现）的架构布局。下面是一个例子，说明如何以 `嵌入式` 模式将其纳入 **审友UI** 库内部。

> **审友UI库**的 type 默认都以 `au-` 前缀开始，au为 `audit-ui` 的缩写

在 [demo](https://github.com/tufeiping/aip-web-template.git) 中有示例，这里说明几个关键点：

- 渲染器扩展点 

  利用 [注册组件](##注册组件) 的方式，扩展一个已有的组件，如这里扩展示例中的 `pages/FrameComp`组件

  ~~~typescript
  import React from "react";
  import { Renderer, RendererProps } from "amis/lib/factory";
  import FrameComp, { IFrameProps } from "../pages/FrameComp"; // 引入我们自己的组件
  
  type IAuditFrameProps = RendererProps & IFrameProps; // 申明一个新的类型别名，包含render-props和iframe-props
  
  @Renderer({
    type: "au-iframe",
  }) // 注册到amis环境中，以便使用 type: "audit-iframe" 来引用
  export class FrameCompRenderer extends React.Component<RendererProps> {
    render() {
      const { render, body, src, title, height, ...rest } = this.props as IAuditFrameProps; // props 进行类型转换，读取src等属性
      return (
        <FrameComp src={src} title={title} height={height} {...rest}></FrameComp>
      );
    }
  }
  ~~~
  > 通过这个例子，其实也能了解 `amis` 库中 `components` 与 `renderers` 分离的架构初衷


- 注册到`amis`体系

  扩展后的代码，需要在系统启动后完成`注册`工作，这里通过 `import` 导入即可完成`注解`（高阶函数） `@Renderer`的执行。

  ~~~typescript
  import React from "react";
  import ReactDOM from "react-dom";
  
  import JsonDebug from "./pages/JsonDebug";
  import "./renderers/FrameCompRenderer"; // 注册组件(实际不引入任何组件，就是完成注册操作)，便于JsonDebug能直接使用 audit-iframe
  import "amis/lib/themes/default.css";
  
  ReactDOM.render(<JsonDebug />, document.getElementById("root"));
  
  ~~~

- JSON-Schema示例代码
~~~json
{
    "type": "page",
    "body": {
          "type": "au-iframe",
          "name": "test",
          "label": "None",
          "src": "https://www.xxx.cn",
          "title": "个人博客"
    }
}

~~~

`DEMO`中还有将`表格组件`嵌入的示例，可以通过`JSON-Schema`定义查看，源码也演示了如何嵌入一个成熟的*第三方 (来自iuap的tinper组件)*组件的方式。

~~~json
{
  "type": "page",
  "body": {
    "type": "form",
    "body": [
      {
        "type": "au-handtable",
        "name": "test",
        "label": "Text",
        "colHeaders": ["姓名", "等级", "性别", "时间"],
        "cdata": [
          {
            "id": 1,
            "name": "张小贝",
            "level": 19,
            "gender": "1",
            "time": "09:20:30"
          },
          {
            "id": 2,
            "name": "张小贝",
            "level": 10,
            "gender": "1",
            "time": "09:20:30"
          },
          {
            "id": 3,
            "name": "张小贝",
            "level": 20,
            "gender": "0",
            "time": "09:20:30"
          },
          {
            "id": 4,
            "name": "张小贝",
            "level": 20,
            "gender": "0",
            "time": "09:20:30"
          }
        ],
        "rowKey": "id",
        "colWidths": [150, 100, 100, 220, null],
        "columnHeaderHeight": 30,
        "width": 520,
        "height": 400,
        "columns": [
          {
            "data": "name",
            "textTooltip": true
          },
          {
            "data": "level",
            "type": "numeric"
          },
          {
            "data": "gender",
            "type": "select",
            "source": [
              {
                "value": "请选择",
                "key": ""
              },
              {
                "value": "男",
                "key": "1"
              },
              {
                "value": "女",
                "key": "0"
              }
            ],
            "dropdownMenu": true
          },
          {
            "data": "time",
            "type": "time",
            "timeFormat": "hh:mm:ss",
            "correctFormat": true
          }
        ]
      },
      {
        "type": "button-toolbar",
        "label": "按钮组",
        "buttons": [
          {
            "type": "button",
            "label": "按钮",
            "actionType": "dialog",
            "dialog": {
              "title": "提示",
              "body": "对，你刚点击了！"
            }
          },
          {
            "type": "submit",
            "label": "提交"
          },
          {
            "type": "reset",
            "label": "重置"
          }
        ]
      }
    ]
  }
}

~~~




## 如何开发调试？

开发调试需要启动两个服务

~~~bash
npm run dev
npm run serve
~~~

然后通过 [http://localhost:8888](http://localhost:8888) 进行查看和调试，`dev`任务能 **watch**到源码改变并动态编译到`public`目录，`serve`任务实时更新，前端刷新可见💐

> 这里注意启动顺序



## 类似的框架考察

现在开源社区类似 `AMIS`的框架不少，大厂凭借自己雄厚的实力，也开源的质量很好的类似框架，如

- 京东 `DripForm`
- 阿里 `Formily`

都是基于 `JSON-Schema`模式构建前端应用，可以从不同的源码（均为开源项目）汲取好的东西做整合。基于 `JSON-Schema`模式的前端技术框架会成为未来的主流（关注业务而无需过度关注技术本身）。



<div style="text-align: right"><small>北京用友审计软件有限公司 公共研发中心 2021-12</small></div>
