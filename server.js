var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var app = new (require('express'))()
var port = 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get("/add", function(req, res) {
  res.sendFile(__dirname + '/add.html')
})

app.get(["/edit/*","/edit"], function(req, res) {
  res.sendFile(__dirname + '/edit.html')
})

app.get("/page", function(req, res) {
  res.sendFile(__dirname + '/page.html')
})

app.get("/shop/id/*", function(req, res) {
  res.send({"shopInfoId":"500dba0a-64a0-47b4-a5a8-c3e77b0eacb3","shopName":"搜索","seq":10,"shopAddress":"shopAddress","shopTel":"1300000000","isSend":"1","imgUrl":"imgUrl","gpsX":1.0000,"gpsY":1.0000,"createUserName":"userName","createTime":"2016-09-02 08:55:12","createUserId":"createUserId","avgRate":5.00})
})
app.get("/shop/list/*", function(req, res) {
  res.send([{"shopInfoId":"fee708b2-7b9c-404a-8f09-3a40e48204ce","shopName":"test","seq":10,"shopAddress":"shopAddress","shopTel":"1300000000","isSend":"1","imgUrl":"imgUrl","gpsX":0.0000,"gpsY":0.0000,"state":"state","avgRate":0.00},{"shopInfoId":"ef7568e7-6751-4f2f-8eb6-1895f0405825","shopName":"test","seq":10,"shopAddress":"shopAddress","shopTel":"1300000000","isSend":"1","imgUrl":"imgUrl","gpsX":0.0000,"gpsY":0.0000,"state":"state","avgRate":0.00},{"shopInfoId":"de844f92-f99c-4ac8-9ab8-70b753222453","shopName":"test","seq":10,"shopAddress":"shopAddress","shopTel":"1300000000","isSend":"1","imgUrl":"imgUrl","gpsX":10.0000,"gpsY":10.0000,"state":"state","avgRate":0.00},{"shopInfoId":"298e764e-11e0-4c91-b6f8-d621e73b632d","shopName":"test","seq":10,"shopAddress":"shopAddress","shopTel":"1300000000","isSend":"1","imgUrl":"imgUrl","gpsX":1.0000,"gpsY":1.0000,"state":"state","avgRate":0.00},{"shopInfoId":"4787829a-ae68-4adf-8db9-ae2a4b20ce6a","shopName":"test","seq":10,"shopAddress":"shopAddress","shopTel":"1300000000","isSend":"1","imgUrl":"imgUrl","gpsX":1.0000,"gpsY":1.0000,"state":"state","avgRate":0.00},{"shopInfoId":"500dba0a-64a0-47b4-a5a8-c3e77b0eacb3","shopName":"搜索","seq":10,"shopAddress":"shopAddress","shopTel":"1300000000","isSend":"1","imgUrl":"imgUrl","gpsX":1.0000,"gpsY":1.0000,"avgRate":5.00},{"shopInfoId":"c11301bc-7215-446e-a203-0c2673db95d8","shopName":"test","seq":10,"shopAddress":"shopAddress","shopTel":"1300000000","isSend":"1","imgUrl":"imgUrl","gpsX":1.0000,"gpsY":1.0000,"state":"state","avgRate":0.00}])
})



app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
