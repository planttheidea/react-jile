'use strict';

const path = require('path');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  devtool: '#source-map',

  entry: [
    path.resolve (__dirname, 'src', 'index.js')
  ],

  eslint: {
    configFile: '.eslintrc',
    emitError: true,
    failOnError: true,
    failOnWarning: true,
    formatter: require('eslint-friendly-formatter')
  },

  externals: {
    'jile': {
      amd: 'jile',
      commonjs: 'jile',
      commonjs2: 'jile',
      root: 'jile'
    },
    'react': {
      amd: 'react',
      commonjs: 'react',
      commonjs2: 'react',
      root: 'React'
    }
  },

  module: {
    preLoaders: [
      {
        include: [
          /src/
        ],
        loader: 'eslint-loader',
        test: /\.js$/
      }
    ],

    loaders: [
      {
        include: [
          /src/
        ],
        loader: 'babel',
        test: /\.js?$/
      }
    ]
  },

  output: {
    filename: 'react-jile.js',
    library: 'ReactJile',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ]),
    new LodashModuleReplacementPlugin({
      collections: true
    })
  ],

  resolve: {
    extensions: [
      '',
      '.js'
    ],

    root: __dirname
  }
};
