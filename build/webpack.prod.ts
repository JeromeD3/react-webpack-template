//  打包环境
import path from 'path'
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import CopyPlugin from 'copy-webpack-plugin'
import baseConfig from './webpack.base'

// import MiniCssExtractPlugin from 'mini-css-extract-plugin'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
// 用于处理 js 的压缩和混淆-> webpack内置，但是手动设置了optimization.minimizer压缩css后,js压缩就失效了，所以需要手动配置
import TerserPlugin from 'terser-webpack-plugin'
// 预先准备的资源压缩版本，使用 Content-Encoding 提供访问服务
import CompressionPlugin from 'compression-webpack-plugin'

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
          filter: (source) => !source.includes('index.html'), // 忽略index.html
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css', // 抽离css的输出目录和名称
    }),
    // 打包时生成gzip文件
    new CompressionPlugin({
      test: /\.(css|js)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8, // 压缩率,默认值是 0.8
    }),
  ],
  optimization: {
    runtimeChunk: {
      name: 'mainifels',
    },
    minimize: true, // 开启压缩
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'], // 删除console.log
          },
        },
      }),
    ],
  },
  performance: {
    hints: false,
    maxAssetSize: 4000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 5000000, // 整数类型（以字节为单位）
  },
})

export default prodConfig
