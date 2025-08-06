import type { Configuration } from 'webpack'
import path from 'node:path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import webpack from 'webpack'

const config: Configuration = {
  entry: {
    'entry.page1': path.resolve('./app/pages/page1/entry.page1.ts'),
    'entry.page2': path.resolve('./app/pages/page2/entry.page2.ts'),
  },
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
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          path.resolve('app'),
        ],
        exclude: /node_modules/,
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

    // 进度插件
    new webpack.ProgressPlugin({
      modules: true,
      modulesCount: 500,
      profile: true,
    }),

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

    // 生成 html 文件
    new HtmlWebpackPlugin({
      template: path.resolve('./app/views/entry.pug'),
      filename: path.resolve('dist/entry.page1.html'),
      chunks: ['entry.page1'],
    }),

    new HtmlWebpackPlugin({
      template: path.resolve('./app/views/entry.pug'),
      filename: path.resolve('dist/entry.page2.html'),
      chunks: ['entry.page2'],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
}

export default config
