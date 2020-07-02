const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: [
    './src/client/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              url: (url) => !url.includes('mCSB_buttons.png')// ignore for malihu-custom-scrollbar-plugin
            }
          },
          // 'postcss-loader' - nop css are only third party
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/i,
        use: [
          'html-loader',
        ]
      },
      { test: require.resolve('jquery-mousewheel'), loader: "imports-loader?define=>false&this=>window" },
      { test: require.resolve('malihu-custom-scrollbar-plugin'), loader: "imports-loader?define=>false&this=>window" }
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({ // https://webpack.js.org/plugins/provide-plugin/#usage-jquery-with-angular-1
      'window.jQuery': 'jquery',
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
      filename: 'index.html'
    })
  ],
  devServer: {
    contentBase: './dist'
  }
};

module.exports = config;