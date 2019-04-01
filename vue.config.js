const path = require('path');
const webpack = require('webpack');
const utils = require('@endpass/utils/build');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { getEnv } = require('./env');

const { NODE_ENV, SOURCE_MAP } = process.env;
const ENV = getEnv(NODE_ENV);

module.exports = {
  baseUrl: '',

  productionSourceMap: false,

  configureWebpack: {
    devtool: SOURCE_MAP && 'cheap-module-eval-source-map',

    plugins: [
      new webpack.DefinePlugin({
        ENV: JSON.stringify(ENV),
      }),
      // new HtmlWebpackPlugin({
      //   meta: {
      //     build: getCommitHash(),
      //   },
      // }),
    ],
    output: {
      filename: '[name].[hash:8].js',
      chunkFilename: '[name].[hash:8].js',
    },
  },

  pluginOptions: {
    svgSprite: {
      /*
       * The directory containing your SVG files.
       */
      dir: 'src/assets/icons',
      /*
       * The reqex that will be used for the Webpack rule.
       */
      test: /\.(svg)(\?.*)?$/,
      /*
       * @see https://github.com/kisenka/svg-sprite-loader#configuration
       */
      loaderOptions: {
        extract: true,
        spriteFilename: 'icons.[hash:8].svg', // or 'img/icons.svg' if filenameHashing == false
      },
      /*
       * @see https://github.com/kisenka/svg-sprite-loader#configuration
       */
      pluginOptions: {
        plainSprite: true,
      },
    },
  },

  css: {
    extract: {
      filename: '[name].[hash:8].css',
      chunkFilename: '[name].[hash:8].css',
    },
  },

  chainWebpack: config => {
    config.resolve.alias.set('@', path.resolve(__dirname, './src'));

    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|ico)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 1,
        name: '[name].[hash:8].[ext]',
      });

    config.module
      .rule('svg-sprite')
      .use('svgo-loader')
      .loader('svgo-loader');
    config.plugin('html').tap(args => {
      const options = Object.assign(args[0], {
        meta: {
          build: utils.getCommitHash(),
        },
      });
      return [options];
    });

    config.plugins.delete('prefetch');
  },
  devServer: {
    proxy: {
      '^/identity/api/v1.1': {
        target: ENV.identity.url,
        changeOrigin: true,
        pathRewrite: {
          '^/identity': '',
        },
        cookieDomainRewrite: 'localhost',
      },
    },
    // https: true,
  },

  outputDir: path.resolve(__dirname, './dist/app'),
};
