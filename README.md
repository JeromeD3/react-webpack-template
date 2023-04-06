# react-webpack-template

> 一个基于webpack5的react项目模板

## webpack相关配置

### 样式与处理器

- 引入 less、sass（scss）、stylus
  - 处理CSS3前缀在浏览器中的兼容
- 处理其他常用资源
  - 处理图片
  - 处理字体和媒体
  - 处理json资源
- babel 处理 js 非标准语法 (装饰器)

### 热更新

> 浏览器会自动刷新后再显示修改后的内容，但我们想要的不是刷新浏览器，而是在不需要刷 新浏览器的前提下模块热更新，并且能够保留react组件的状态。

### webpack构建速度优化

- webpack 进度条
- 构建耗时统计
- 开启持久化存储缓存
- 开启多线程 loader
- 缩小构建目标（remove node_modules）
- devtools 配置 (source-map ...)

### webpack 构建产物优化

- bundle 体积分析工具
- 样式提取 MiniCssExtractPlugin(方便热替换)
- 样式压缩
- js 压缩
- 文件指纹 (hash -> 浏览器缓存)
- 代码分割 (分割第三方代码 -> 打包)
- tree-shaking清理未引用js、css
- 资源懒加载
- 资源预加载
- gzip 压缩

## 其他优化 (针对具体项目优化)

- DllPlugin：动态链接库
- sideEffect：副作用
- externals: 外包拓展，打包时会忽略配置的依赖，会从上下文中寻找对应变量
- module.noParse: 匹配到设置的模块，将不进行依赖解析，适合jquery，-= - - boostrap这类不依赖外部模块的包
- ignorePlugin: 可以使用正则忽略一部分文件，常在使用多语言的包时可以把非中文语言包过滤掉

## 代码质量和git提交规范

### 代码格式

- 代码格式规范和语法检测工具
  - EditorConfig
  - ESLint
  - Prettier
  - Stylelint
  - Markdownlint

### 提交规范

- 使用lint-staged优化eslint检测速度
- 使用tsc检测类型和报错
- 代码提交前husky检测语法和格式
- 使用commitlint规范git提交信息
- Commitizen（个人觉得不好用👎）
  - cz-git
- change-log

## ChangeLog

主版本号.次版本号.修订号，版本号递增规则如下：

- 主版本号(major)：当你做了不兼容的 API 修改，
- 次版本号(minor)：当你做了向下兼容的功能性新增，可以理解为 Feature 版本，
- 修订号(patch)：当你做了向下兼容的问题修正，可以理解为 Bug fix 版本。

### tsconfig.json配置参考

``` json
{
  "compilerOptions": {

    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件作为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}
```
