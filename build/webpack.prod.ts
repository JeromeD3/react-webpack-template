//  打包环境
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import baseConfig from './webpack.base'

const prodConfig: Configuration = merge(baseConfig, {
  mode: 'production', // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
})

export default prodConfig
