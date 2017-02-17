var path = require('path')
var webpack = require('webpack')
var rootPath = "/Users/song/work/react/Mine/tools";

module.exports = {
  //记着发布时候要去掉devtools否则打包很大
  devtool: 'cheap-module-eval-source-map',  
  entry: {
    hot: 'webpack-hot-middleware/client',
    bootstrapCssWrapper: './entry/bootstrap-css',
    editFormGenerator: './entry/editFormGenerator',
    d2EditFormGenerator: './entry/d2EditFormGenerator',
    d3EditFormGenerator: './entry/d3EditFormGenerator',
    d2TaskExpertsGen:'./entry/d2TaskExpertsGen',
    d3TaskExpertsGen:'./entry/d3TaskExpertsGen',
    dTaskExpertsEditGen: './entry/dTaskExpertsEditGen',
    pageListGenerator: './entry/pageListGenerator',
    dqListGenerator: './entry/dqListGenerator',
    invoiceListGenerator: './entry/invoiceListGenerator',
    dqTaskExpert:"./entry/dqTaskExpert",
    standardRespFormGenerator:"./entry/standardRespFormGenerator",
    reimburseFormGenerator:"./entry/reimburseFormGenerator",
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-bundle.js',
    publicPath: '/js/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
            }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    //限制整体chunk的数量，如果chunk数量大于num，则不会有splitting
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
    //会合并大小小于\d b的chunk，但至少会有一个 不会合并到parent中
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 1000}),
    new webpack.optimize.CommonsChunkPlugin("commonV3.js",["editFormGenerator", "pageListGenerator", "d2EditFormGenerator", "d2TaskExpertsGen", 
      "d3EditFormGenerator", "d3TaskExpertsGen", "dTaskExpertsEditGen", "dqListGenerator", "dqTaskExpert", "standardRespFormGenerator", "invoiceListGenerator","reimburseFormGeneratore"]),
    new webpack.optimize.UglifyJsPlugin({compress:{warnings:false}})
  ],
  module: {
    loaders: [
      {test: /\.css$/, loader: require.resolve("style-loader") + "!" + require.resolve("css-loader")},
      {test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$|\.woff2$|\.eot$/, loader: require.resolve("file-loader") + "?name=images/[hash:8].[ext]"},
      { test: /jquery$|jquery(-|\d|\.|min)*.js$/, loader: 'expose?jQuery!expose?$' },
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  },
  resolve: { 
     alias: {
        //jquery: "/Users/song/work/nodejs/webpackTest/6th/js/common/jquery-1.11.3.js",
        //path join 解决相对路径问题 
        //sem: rootPath+"/js/modules/sem_module.js",
        jquery: rootPath +"/lib/jquery-2.2.1.min.js",
     }
  },
}
