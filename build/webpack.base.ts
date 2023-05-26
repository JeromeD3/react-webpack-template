import { Configuration, DefinePlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import * as dotenv from 'dotenv'
import WebpackBar from 'webpackbar'

const path = require('path')
const nodeExternals = require('webpack-node-externals')

const tsxRegex = /\.(ts|tsx)$/
const cssRegex = /\.css$/
const sassRegex = /\.(scss|sass)$/
const lessRegex = /\.less$/
const stylRegex = /\.styl$/
const imageRegex = /\.(png|jpe?g|gif|svg)$/i
const fontRegex = /.(woff2?|eot|ttf|otf)$/
const mediaRegex = /.(mp4|webm|ogg|mp3|wav|flac|aac)$/

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development' // 是否是开发模式

// 加载配置文件
const envConfig = dotenv.config({
  path: path.resolve(__dirname, `../env/.env.${process.env.BASE_ENV}`)
})

const getStyleLoaders = (cssLoaderOpts: any) => {
  const loaders = [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
    {
      /** 三个作用：
       * 1. CSS 模块化：将 CSS 模块化可以避免命名冲突，提高代码复用性。
       * 2. 自动添加浏览器前缀：在 CSS 样式中自动添加浏览器前缀，以提高浏览器兼容性。
       * 3. 将 CSS 中的 URL 转换成 require：将 CSS 中的图片路径转换成 Webpack 所需的 require 路径。
       */
      loader: 'css-loader',
      options: cssLoaderOpts
    },
    'postcss-loader'
  ]

  return loaders
}

const tsLoader = {
  test: /\.tsx?$/,
  exclude: /node_modules/,
  use: {
    loader: 'swc-loader',
    options: {
      jsc: {
        parser: {
          tsx: true,
          syntax: 'typescript',
          decorators: true
        },
        target: 'es5',
        transform: {
          react: {
            // swc-loader will check whether webpack mode is 'development'
            // and set this automatically starting from 0.1.13. You could also set it yourself.
            // swc won't enable fast refresh when development is false
            runtime: 'automatic'
          }
        }
      }
    }
  }
}

const baseConfig: Configuration = {
  entry: path.join(__dirname, '../src/index.tsx'), // 入口文件
  // 打包出口文件
  output: {
    filename: 'static/js/[name].[chunkhash:8].js', // 每个输出js的名称 + 添加文件指纹 ==> 添加chunkhash
    path: path.join(__dirname, '../dist'), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: '/', // 打包后文件的公共前缀路径
    assetModuleFilename: 'images/[name].[contenthash:8][ext]'
  },
  // loader 配置
  module: {
    rules: [
      // ts
      // tsLoader,
      {
        test: tsxRegex,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2015'
        }
      },
      // {
      //   test: tsxRegex, // 匹配.ts, tsx文件
      //   exclude: /node_modules/, // 排除node_modules文件夹,一般第三方库已经编译好了，不需要我们去解析
      //   use: ['babel-loader']
      //   // use: ['thread-loader', 'babel-loader'],
      //   // 多线程打包，甚用，最好是项目变大之后再用
      // },
      // css
      {
        test: cssRegex, // 匹配 css 文件
        use: getStyleLoaders({
          // importLoaders: 1, // 指定在 CSS 中 @import 的文件也要被 css-loader 处理，默认为 0。
          // 启用 CSS 模块化，默认为 false。
          modules: {
            mode: 'icss',
            localIdentName: '[path][name]__[local]--[hash:5]'
          }
        })
      },
      // less
      {
        test: lessRegex,
        use: [
          ...getStyleLoaders({
            importLoaders: 2, // 指定在 CSS 中 @import 的文件也要被 css-loader 处理，默认为 0。
            // 启用 CSS 模块化，默认为 false。
            modules: {
              mode: 'local',
              localIdentName: '[path][name]__[local]--[hash:5]'
            }
          }),
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                importLoaders: 2,
                // 可以加入modules: true，这样就不需要在less文件名加module了
                // 或者直接添加声明文件.d.ts
                // modules: true,
                // 如果要在less中写类型js的语法，需要加这一个配置
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      // sass
      {
        test: sassRegex,
        use: [
          ...getStyleLoaders({
            importLoaders: 2, // 指定在 CSS 中 @import 的文件也要被 css-loader 处理，默认为 0。
            // 启用 CSS 模块化，默认为 false。
            modules: {
              mode: 'local',
              localIdentName: '[path][name]__[local]--[hash:5]'
            }
          }),
          {
            loader: 'sass-loader',
            options: {
              // eslint-disable-next-line import/no-extraneous-dependencies, global-require
              implementation: require('sass') // 使用dart-sass代替node-sass
            }
          }
        ]
      },
      // stylus
      {
        test: stylRegex,
        use: [
          ...getStyleLoaders({
            importLoaders: 2, // 指定在 CSS 中 @import 的文件也要被 css-loader 处理，默认为 0。
            // 启用 CSS 模块化，默认为 false。
            modules: {
              mode: 'local',
              localIdentName: '[path][name]__[local]--[hash:5]'
            }
          }),
          'stylus-loader'
        ]
      },
      // 图片
      {
        test: imageRegex, // 匹配图片文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024 // 小于10kb转base64
          }
        },
        generator: {
          filename: 'static/images/[name].[contenthash:8][ext]' // 文件输出目录和命名
        }
      },
      // 字体
      {
        test: fontRegex, // 匹配字体图标文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb转base64
          }
        },
        generator: {
          filename: 'static/fonts/[name].[contenthash:8][ext]' // 文件输出目录和命名
        }
      },
      //  媒体文件
      {
        test: mediaRegex, // 匹配媒体文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb转base64
          }
        },
        generator: {
          filename: 'static/media/[name].[contenthash:8][ext]' // 文件输出目录和命名
        }
      },
      // json
      {
        test: /\.json$/,
        type: 'asset/resource', // 将json文件视为文件类型
        generator: {
          // 这里专门针对json文件的处理
          filename: 'static/json/[name].[hash][ext][query]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    // 别名需要配置两个地方，这里和 tsconfig.json
    alias: {
      '@': path.join(__dirname, '../src')
    },
    modules: ['../node_modules']
    // modules: [path.resolve(__dirname, '../node_modules')], // 查找第三方模块只在本项目的node_modules中查找
  },
  // plugins
  plugins: [
    new WebpackBar({
      color: '#85d', // 默认green，进度条颜色支持HEX
      basic: false, // 默认true，启用一个简单的日志报告器
      profile: false // 默认false，启用探查器。
    }),
    new HtmlWebpackPlugin({
      title: 'webpack5-react-ts',
      filename: 'index.html',
      // 复制 'index.html' 文件，并自动引入打包输出的所有资源（js/css）
      template: path.join(__dirname, '../public/index.html'),
      inject: true, // 自动注入静态资源
      hash: true,
      cache: false,
      // 压缩html资源
      minify: {
        removeAttributeQuotes: true, // 去除属性引号
        collapseWhitespace: true, // 去空格
        removeComments: true, // 去注释
        minifyJS: true, // 在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
        minifyCSS: true // 缩小CSS样式元素和样式属性F
      },
      nodeModules: path.resolve(__dirname, '../node_modules')
    }),
    new DefinePlugin({
      // https://www.webpackjs.com/plugins/define-plugin/
      // 允许在 编译时 将你代码中的变量替换为其他值或表达式
      'process.env': JSON.stringify(envConfig.parsed),
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  // 缓存
  cache: {
    type: 'filesystem' // 使用文件缓存
  }
  // 打包排除第三方依赖 --> 一般用于编写第三方库的时候会用到，防止将第三方库打包进去
  // externals: [nodeExternals()]
}

export default baseConfig
