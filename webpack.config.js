const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
// 引入html处理插件，会创建一个index.html，并且自动引入打包后的所有资源
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, './build')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 以该路径的html文件为模板，在打包后的文件中生成html文件，并且自动引入打包后的所有资源
      template: './src/index.html'
    })
  ],
  mode: 'development',
  // devServer: {
  //   contentBase:resolve(__dirname,'build'),
  //   port:3000,

  // }
}