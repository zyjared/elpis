import type { Configuration } from 'webpack'
import path from 'node:path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import glob from 'tiny-glob'
import AutoImport from 'unplugin-auto-import/webpack'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/webpack'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/webpack'
import { VueLoaderPlugin } from 'vue-loader'
import webpack from 'webpack'

export async function getCommonConfig(options: {
  outputDir?: string
} = {}): Promise<Configuration> {
  const {
    outputDir = './dist',
  } = options

  const entryList = await glob(`app/views/**/entry.*.ts`)

  const entry = entryList.reduce<Record<string, string>>((acc, cur) => {
    const filepath = path.resolve(cur)
    acc[path.basename(filepath, '.ts')] = filepath
    return acc
  }, {})

  const htmlPluginList = Object.keys(entry).map((name) => {
    // https://github.com/jantimon/html-webpack-plugin#options
    return new HtmlWebpackPlugin({
      // https://github.com/jantimon/html-webpack-plugin/blob/main/docs/template-option.md
      template: path.resolve(`app/templates/entry.pug`),
      filename: path.resolve(`${outputDir}/${name}.html`),
      chunks: [name],
      inject: true,
      publicPath: 'auto',
    })
  })

  return {
    entry,
    output: {
      path: path.resolve(outputDir),
      filename: 'static/js/[name]_[chunkhash:8].bundle.js',
      publicPath: './',
      crossOriginLoading: 'anonymous',
      clean: true,
    },
    module: {
      unsafeCache: false,
      rules: [
        {
          test: /\.vue$/,
          use: {
            loader: 'vue-loader',
          },
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
          test: /\.s?[ac]ss$/i,
          use: [
            'vue-style-loader',
            // 'style-loader',
            {
              loader: 'css-loader',
              options: {
                esModule: false,
                importLoaders: 1,
                modules: {
                  auto: true, // 只对包含.module.css的文件启用CSS模块
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              },
            },
            'sass-loader',
          ],
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
        '~': path.resolve('./'),
        '@': path.resolve('./app'),
      },
    },

    plugins: [
    // 为 vue 文件各部分提供 loader
      new VueLoaderPlugin(),

      // 自动注入第三方库到全局
      new webpack.ProvidePlugin({
        Vue: 'vue',
        axios: 'axios',
        _: 'lodash',
      }),

      // 定义全局变量
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      }),

      ...htmlPluginList,

      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
        dts: './app/auto-imports.d.ts',
      }),

      Components({
        resolvers: [
          IconsResolver({
            enabledCollections: ['ep'],
          }),
          ElementPlusResolver(),
        ],

        dts: './app/components.d.ts',
      }),

      Icons({
        autoInstall: true,
      }),
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
            priority: 80,
            enforce: true,
          },
          // 公共代码
          common: {
            name: 'common',
            minChunks: 2,
            reuseExistingChunk: true,
            priority: 10,
          },
        },
      },
    },
  }
}
