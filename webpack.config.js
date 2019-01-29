var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  entry:{
     index:'./app/javascripts/index.js',
     main:'./app/javascripts/main.js',
     file_information:'./app/javascripts/file_information.js',
     file_menu:'./app/javascripts/file_menu.js',
     buy_menu:'./app/javascripts/buy_menu.js',
     history_menu:'./app/javascripts/history_menu.js',
     manage_menu:'./app/javascripts/manage_menu.js',
     sell_menu:'./app/javascripts/sell_menu.js',
     bground:'./app/javascripts/bground.js'
  },
  output:{
     path:path.resolve(__dirname,'build'),
     publicPath:'',
     filename:'./js/[name].js',
     chunkFilename:'./js/[id].chunk.js'
     //filename: 'app.js'

  },
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }, 
  plugins: [
      new HtmlWebpackPlugin({//CopyWebpackPlugin([
      //{ from: './app/index.html', to: "index.html" }
        filename:'./index.html',
        template: './app/index.html',
        inject:true,
        chunks:['index']
      }),
      new HtmlWebpackPlugin({
        filename:'./main.html',
        template: './app/main/main.html',
        inject:true,
        chunks:['main']
      }),
      new HtmlWebpackPlugin({
        filename:'./file_information.html',
        template: './app/main/file_information.html',
        inject:true,
        chunks:['file_information']
      }),
     new HtmlWebpackPlugin({
        filename:'./file_menu.html',
        template: './app/main/file_menu.html',
        inject:true,
        chunks:['file_menu']
      }),
     new HtmlWebpackPlugin({
        filename:'./buy_menu.html',
        template: './app/main/file_detail/buy_menu.html',
        inject:true,
        chunks:['buy_menu']
      }),
     new HtmlWebpackPlugin({
        filename:'./history_menu.html',
        template: './app/main/file_detail/history_menu.html',
        inject:true,
        chunks:['history_menu']
      }),
     new HtmlWebpackPlugin({
        filename:'./manage_menu.html',
        template: './app/main/file_detail/manage_menu.html',
        inject:true,
        chunks:['manage_menu']
      }),
     new HtmlWebpackPlugin({
        filename:'./sell_menu.html',
        template: './app/main/file_detail/sell_menu.html',
        inject:true,
        chunks:['sell_menu']
      }),
     new HtmlWebpackPlugin({
        filename:'./bground.html',
        template: './app/main/file_detail/bground.html',
        inject:true,
        chunks:['bground']
      }),
      //new webpack.HotModuleReplacementPlugin()
  ],
  //devServer:{
     // contentBase:'./',
     // host:'localhost',
//port: 9092,
      //inline:true,
      //hot:true,
 // }
};
