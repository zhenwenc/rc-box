/* global __dirname */
/* eslint-disable no-multi-spaces */

'use strict'

var webpack      = require('webpack')

var HtmlWebpackPlugin  = require('html-webpack-plugin')
var ForkCheckerPlugin  = require('awesome-typescript-loader').ForkCheckerPlugin

var ENV = process.env.ENV = 'development'
var HMR = true

var HOST = process.env.HOST || 'localhost'
var PORT = process.env.PORT || 9090

module.exports = {

  devtool: 'cheap-module-eval-source-map',

  debug: true,

  entry: './demo/main.tsx',

  resolve: {
    extensions: ['', '.ts', '.tsx', '.js'],
    modulesdirectories: [
      '',
      'src',
      'node_modules',
    ],
    root: 'demo',
  },

  module: {

    preLoaders: [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],

    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: [/\.(spec|e2e)\.ts$/],
      },
    ],

    postLoaders: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: [ 'react', 'es2015' ],
        },
      },
    ],

  },

  htmlLoader: {
    minimize: true,
    removeAttributeQuotes: false,
    caseSensitive: true,
    customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
    customAttrAssign: [ /\)?\]?=/ ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(ENV),
      'HMR': HMR,
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV),
        'HMR': HMR,
      },
    }),
    new ForkCheckerPlugin(),
    new HtmlWebpackPlugin({
      template: 'demo/index.html',
      chunksSortMode: 'none',
    }),
  ],

  devServer: {
    port: PORT,
    host: HOST,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    stats: { colors: true },
  },

  node: {
    global: 'window',
    progress: true,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false,
  },

}
