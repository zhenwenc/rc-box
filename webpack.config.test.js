'use strict'

module.exports = {
  devtool: 'inline-source-map',
  resolve: {
    extensions: [ '', '.js', '.ts', '.tsx' ],
    modulesdirectories: [
      'node_modules',
    ],
    root: 'src',
  },
  resolveLoader: {
    root: 'node_modules',
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
        query: {
          'compilerOptions': {
            'removeComments': true,
          },
        },
        exclude: [ /\.e2e\.ts$/, /(node_modules|bower_components)/ ],
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
      }, {
        test: /\.(js|ts)x?$/,
        include: 'test',
        loader: 'istanbul-instrumenter-loader',
        exclude: [ /\.(e2e|spec)\.ts$/, /node_modules/ ],
      },
    ],
  },
  node: {
    global: 'window',
    progress: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false,
  },
}

