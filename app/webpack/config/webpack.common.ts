import type { Configuration } from 'webpack'
import path from 'node:path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import glob from 'tiny-glob'
import { VueLoaderPlugin } from 'vue-loader'
import webpack from 'webpack'

export async function getCommonConfig(): Promise<Configuration> {
  const entryList = await glob('app/pages/**/entry.*.ts')

  const entry = entryList.reduce<Record<string, string>>((acc, cur) => {
    const filepath = path.resolve(cur)
    acc[path.basename(filepath, '.ts')] = filepath
    return acc
  }, {})

  const htmlPluginList = Object.keys(entry).map((name) => {
    return new HtmlWebpackPlugin({
      template: path.resolve(`app/views/entry.pug`),
      filename: path.resolve(`dist/${name}.html`),
      chunks: [name],
    })
  })

  return {
    entry,
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: 'vue-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              targets: 'defaults',
              presets: [
                ['@babel/preset-env'],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                esModule: false,
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
        // https://www.npmjs.com/package/pug-plain-loader
          test: /\.pug$/,
          oneOf: [
          // this applies to pug imports inside JavaScript
            {
              exclude: /\.vue$/,
              use: ['raw-loader', 'pug-plain-loader'],
            },
            // this applies to <template lang="pug"> in Vue components
            {
              use: ['pug-plain-loader'],
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'static/images/[name]_[hash:8][ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'static/fonts/[name]_[hash:8][ext]',
          },
        },
      ],
    },

    resolve: {
      extensions: ['.ts', '.vue', '.css', '.tsx', '.js', '.pug'],
      alias: {
        '@': path.resolve('./app'),
        '$pages': path.resolve('./app/pages'),
      },
    },
    output: {
      filename: 'static/js/[name]_[chunkhash:8].bundle.js',
      path: path.resolve('dist'),
      publicPath: '/',
      crossOriginLoading: 'anonymous',
      clean: true,
    },
    plugins: [
    // 为 vue 文件各部分提供 loader
      new VueLoaderPlugin(),

      // 自动注入第三方库到全局
      new webpack.ProvidePlugin({
        Vue: 'vue',
      }),

      // 定义全局变量
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      }),

      ...htmlPluginList,
    ],
    optimization: {
      // chunk 拆分规则
      // https://webpack.docschina.org/configuration/optimization/#optimizationsplitchunks
      // https://webpack.docschina.org/plugins/split-chunks-plugin/
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 99,
          },
          common: {
            name: 'common',
            minChunks: 2,
            minSize: 1,
            reuseExistingChunk: true,
          },
        },
      },
    },
  }
}
