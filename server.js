const express = require('express')
const app = express()
const fs = require('fs')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const uuidv4 = require('uuid/v4')
const axios = require('axios')
const redis = require('redis'),
    client = redis.createClient(6380, 'petrecv.redis.cache.windows.net', {
        auth_pass: '9V9XjBKBtX5+WI03UNu82T+9DuFkNxVAlncvgNvx9Cg=',
        tls: {
            servername: 'petrecv.redis.cache.windows.net'
        }
    })
const slackWebhook = "https://hooks.slack.com/services/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"

app.use(bodyParser.json())
app.use(cookieParser())

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use('*', (req, res, next) => {

    var cookie = req.cookies.user
    if (cookie === undefined) {
        req.newuser = true
        req.uuid = uuidv4()
        res.cookie('user', req.uuid, {
            maxAge: 900000,
            httpOnly: true
        })
        axios.get("https://randomuser.me/api/").then(response => {
            req.fullname = response.data.results[0].name.first + " " + response.data.results[0].name.last
            client.set(req.uuid, req.fullname, function (err, reply) {

            })
            next()
        }).catch(error => {
            //add logic
        })
    } else {
        req.newuser = false
        req.uuid = cookie
        client.get(req.uuid, function (err, reply) {
            req.fullname = reply
            next()
        });
    }


})

app.get('/', (req, res) => {
    slack({
        "name": req.fullname,
        "action": "visit",
        "newuser": req.newuser
    })
    res.render('home')
})


app.post('/action', (req, res) => {
    slack({
        "name": req.fullname,
        "action": req.body.action,
        "newuser": false
    })
    res.send('ok')
})

app.get('/download', (req, res) => {
    var filePath = "\\files\\Petre_POPESCU_CV.pdf"
    fs.readFile(__dirname + filePath, function (err, data) {
        res.contentType("application/pdf")
        res.send(data)
    })
})

app.use(express.static('public'))

app.listen(process.env.PORT || 3000)

function slack(obj) {
    console.log(obj)
    if (obj.newuser==true){
            slackSend("A new user called "+obj.name+" has visited your CV")
    }
    if (obj.action=="visit" && obj.newuser==false) {
        slackSend(obj.name + " has visited your CV")
    }
    if (obj.action=="download") {
        slackSend(obj.name + " has downloaded your CV")
    }
    if (obj.action=="print") {
        slackSend(obj.name + " has printed your CV")
    }
}

function slackSend(message) {
    axios.post(slackWebhook,{
        text: message
    })
}