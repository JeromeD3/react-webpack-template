//  公共配置
import { Configuration, DefinePlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import * as dotenv from 'dotenv'
import WebpackBar from 'webpackbar'

const path = require('path')
const cssRegex = /\.css$/
const sassRegex = /\.(scss|sass)$/
const lessRegex = /\.less$/
const stylRegex = /\.styl$/

// 加载配置文件
const envConfig = dotenv.config({
  path: path.resolve(__dirname, '../env/.env.' + process.env.BASE_ENV),
})

const styleLoadersArray = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: '[path][name]__[local]--[hash:5]',
      },
    },
  },
  // 用于处理css3前缀在浏览器中的兼容
  'postcss-loader',
]

const baseConfig: Configuration = {
  entry: path.join(__dirname, '../src/index.tsx'), // 入口文件
  // 打包出口文件
  output: {
    filename: 'static/js/[name].js', // 每个输出js的名称
    path: path.join(__dirname, '../dist'), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: '/', // 打包后文件的公共前缀路径
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  // loader 配置
  module: {
    rules: [
      // ts
      {
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        use: ['babel-loader'],
        // use: ['thread-loader', 'babel-loader'],
        // 多线程打包，甚用，最好是项目变大之后再用
      },
      // css
      {
        test: cssRegex, //匹配 css 文件
        use: styleLoadersArray,
      },
      // less
      {
        test: lessRegex,
        use: [
          ...styleLoadersArray,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                importLoaders: 2,
                // 可以加入modules: true，这样就不需要在less文件名加module了
                // 或者直接添加声明文件.d.ts
                // modules: true,
                // 如果要在less中写类型js的语法，需要加这一个配置
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      // sass
      {
        test: sassRegex,
        use: [...styleLoadersArray, 'sass-loader'],
      },
      // stylus
      {
        test: stylRegex,
        use: [...styleLoadersArray, 'stylus-loader'],
      },
      // 图片
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // 匹配图片文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024, // 小于10kb转base64
          },
        },
        generator: {
          filename: 'static/images/[hash][ext][query]', // 文件输出目录和命名
        },
      },
      // 字体
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64
          },
        },
        generator: {
          filename: 'static/fonts/[hash][ext][query]', // 文件输出目录和命名
        },
      },
      //  媒体文件
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64
          },
        },
        generator: {
          filename: 'static/media/[hash][ext][query]', // 文件输出目录和命名
        },
      },
      // json
      {
        test: /\.json$/,
        type: 'asset/resource', // 将json文件视为文件类型
        generator: {
          // 这里专门针对json文件的处理
          filename: 'static/json/[name].[hash][ext][query]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    // 别名需要配置两个地方，这里和 tsconfig.json
    alias: {
      '@': path.join(__dirname, '../src'),
    },
    modules: ['../node_modules'],
    // modules: [path.resolve(__dirname, '../node_modules')], // 查找第三方模块只在本项目的node_modules中查找
  },
  // plugins
  plugins: [
    new WebpackBar({
      color: '#85d', // 默认green，进度条颜色支持HEX
      basic: false, // 默认true，启用一个简单的日志报告器
      profile: false, // 默认false，启用探查器。
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
        collapseWhitespace: true, //去空格
        removeComments: true, // 去注释
        minifyJS: true, // 在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
        minifyCSS: true, // 缩小CSS样式元素和样式属性F
      },
      nodeModules: path.resolve(__dirname, '../node_modules'),
    }),
    new DefinePlugin({
      // https://www.webpackjs.com/plugins/define-plugin/
      // 允许在 编译时 将你代码中的变量替换为其他值或表达式
      'process.env': JSON.stringify(envConfig.parsed),
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  // 缓存
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
}

export default baseConfig
