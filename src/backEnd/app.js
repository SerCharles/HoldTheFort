const express = require('express')
var bodyParser = require('body-parser');

var multipart = require('connect-multiparty')
var multipartMiddleware = multipart()

const path = require('path')
const app = express()

let Handler = require('./repository.js')
let theHandler = new Handler()

app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));



// 处理请求1：
app.post('/score', function (req, res, next) {  
    let name = req.body.name
    let score = req.body.score
    let mode = req.body.mode

    if(score >= 0) {
          theHandler.AddNewKey(name, score, mode);
    }

    let num = theHandler.FindKey(name, mode);
    res.status(200).type('application/json').send({ score: num })

})


// 监听端口8000
app.listen(8000, () => {
  console.log(`App listening at port 8000`)
})
