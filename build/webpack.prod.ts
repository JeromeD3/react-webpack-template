//  打包环境
import path from 'path'
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import CopyPlugin from 'copy-webpack-plugin'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
// 用于处理 js 的压缩和混淆-> webpack内置，但是手动设置了optimization.minimizer压缩css后,js压缩就失效了，所以需要手动配置
import TerserPlugin from 'terser-webpack-plugin'
// 预先准备的资源压缩版本，使用 Content-Encoding 提供访问服务
import CompressionPlugin from 'compression-webpack-plugin'
import baseConfig from './webpack.base'
// 检测文件里面的类名和id
const globAll = require('glob-all')
// 打包的时候移除未使用到的css样式
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')

const prodConfig: Configuration = merge(baseConfig, {
  mode: 'production', // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  /**
   * 打包环境推荐：none(就是不配置devtool选项了，不是配置devtool: 'none')
   * ● none话调试只能看到编译后的代码,也不会泄露源代码,打包速度也会比较快。
   * ● 只是不方便线上排查问题, 但一般都可以根据报错信息在本地环境很快找出问题所在。
   */

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'), // 复制public下文件
          to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
          filter: source => !source.includes('index.html') // 忽略index.html
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css' // 抽离css的输出目录和名称
    }),
    // 清理无用css，检测src下所有tsx文件和public下index.html中使用的类名和id和标签名称
    // 只打包这些文件中用到的样式
    new PurgeCSSPlugin({
      paths: globAll.sync(
        [`${path.join(__dirname, '../src')}/**/*`, path.join(__dirname, '../public/index.html')],
        {
          nodir: true
        }
      ),
      // 用 only 来指定 purgecss-webpack-plugin 的入口
      // https://github.com/FullHuman/purgecss/tree/main/packages/purgecss-webpack-plugin
      only: ['dist'],
      safelist: {
        standard: [/^ant-/] // 过滤以ant-开头的类名，哪怕没用到也不删除
      }
    }),
    // 打包时生成gzip文件
    new CompressionPlugin({
      test: /\.(css|js)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8 // 压缩率,默认值是 0.8
    })
  ],
  optimization: {
    concatenateModules: true, // 开启模块合并
    splitChunks: {
      // 分隔代码
      cacheGroups: {
        vendors: {
          // 提取node_modules代码
          test: /node_modules/, // 只匹配node_modules里面的模块
          name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
          minChunks: 1, // 只要使用一次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: 1 // 提取优先级为1
        },
        commons: {
          // 提取页面公共代码
          name: 'commons', // 提取文件命名为commons
          minChunks: 2, // 只要使用两次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0 // 提取代码体积大于0就提取出来
        }
      }
    },
    runtimeChunk: {
      name: 'mainifels'
    },
    minimize: true, // 开启压缩
    minimizer: [
      new CssMinimizerPlugin({
        minify: CssMinimizerPlugin.esbuildMinify // 自定义压缩器，需要依赖其他包，这里使用esbuild
      }), // 压缩css
      new TerserPlugin({
        minify: TerserPlugin.swcMinify, // 自定义压缩器，需要依赖其他包，这里使用swc
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'] // 删除console.log
          }
        }
      })
    ]
  },
  performance: {
    hints: false,
    maxAssetSize: 4000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 5000000 // 整数类型（以字节为单位）
  }
  // 最小化 watch 监控范围
  // watchOptions: {
  //   ignored: /node_modules/
  // }
})

export default prodConfig
