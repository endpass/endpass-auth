/* eslint-disable no-console */
const path = require('path');
const webpack = require('webpack');
const buildUtils = require('@endpass/utils/build');
const objectUtils = require('@endpass/utils/objects');

const pkg = require('./package.json');

const { SOURCE_MAP, NODE_ENV } = process.env;

const ENV = objectUtils.parseObjectProperties(process.env, 'VUE_APP');

ENV.VUE_APP_VERSION = pkg.version;

// eslint-disable-next-line no-console
console.log('NODE_ENV', NODE_ENV);
// eslint-disable-next-line no-console
console.log('ENV', ENV);

const commitHash = buildUtils.getCommitHash();

module.exports = {
  productionSourceMap: false,

  publicPath: '/',

  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      meta: {
        build: commitHash,
      },
    },
    prepare: {
      entry: 'src/prepare.js',
      template: 'public/prepare.html',
      filename: 'prepare.html',
      inject: false,
    },
  },

  configureWebpack: {
    devtool: SOURCE_MAP && 'cheap-module-eval-source-map',
    resolve: {
      symlinks: false,
    },

    plugins: [
      new webpack.DefinePlugin({
        ENV: JSON.stringify(ENV),
      }),
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
      .test(/\.(png|jpe?g|gif|ico|pdf)(\?.*)?$/)
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

    config.plugins.delete('prefetch');
    config.plugins.delete('prefetch-index');

    config.plugins.delete('prefetch-version');
    config.plugins.delete('preload-version');
    // For yarn link
    config.resolve.symlinks(false);
  },
  devServer: {
    proxy: {
      '^/identity/api/v1.1': {
        target: 'https://identity-dev.endpass.com',
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
