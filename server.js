require('dotenv').config()

const express = require('express')
const app = express()
const fs = require('fs')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const uuidv4 = require('uuid/v4')
const axios = require('axios')
// const redis = require('redis'),
//     client = redis.createClient(6380, process.env.REDIS_ENDPOINT, {
//         auth_pass: process.env.REDIS_KEY,
//         tls: {
//             servername: process.env.REDIS_ENDPOINT
//         }
//     })
// const slackWebhook = process.env.SLACK_WEBHOOK



app.use(bodyParser.json())
app.use(cookieParser())

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

// app.use('*', (req, res, next) => {
//     req.ipaddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     var cookie = req.cookies.user
//     if (cookie === undefined) {
//         req.newuser = true
//         req.uuid = uuidv4()
//         res.cookie('user', req.uuid, {
//             maxAge: 900000,
//             httpOnly: true
//         })
//         axios.get("https://randomuser.me/api/").then(response => {
//             req.fullname = response.data.results[0].name.first + " " + response.data.results[0].name.last
//             client.set(req.uuid, req.fullname, function (err, reply) {

//             })
//             next()
//         }).catch(error => {
//             //add logic
//         })
//     } else {
//         req.newuser = false
//         req.uuid = cookie
//         client.get(req.uuid, function (err, reply) {
//             req.fullname = reply
//             next()
//         });
//     }


// })

app.get('/', (req, res) => {
    // slack({
    //     "name": req.fullname,
    //     "action": "visit",
    //     "newuser": req.newuser,
    //     "ip": req.ipaddr
    // })
    res.render('home')
})


app.post('/action', (req, res) => {
    // slack({
    //     "name": req.fullname,
    //     "action": req.body.action,
    //     "newuser": false,
    //     "ip": req.ipaddr
    // })
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

app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on " + process.env.PORT + " or 3000")
})

function slack(obj) {
    if (obj.newuser == true) {
        slackSend("A new user called " + obj.name + " has visited your CV from IP "+obj.ip)
    }
    if (obj.action == "visit" && obj.newuser == false) {
        slackSend(obj.name + " has visited your CV from IP "+obj.ip)
    }
    if (obj.action == "download") {
        slackSend(obj.name + " has downloaded your CV from IP "+obj.ip)
    }
    if (obj.action == "print") {
        slackSend(obj.name + " has printed your CV from IP "+obj.ip)
    }
    if (obj.action == "github") {
        slackSend(obj.name + " has visited your Github page from IP "+obj.ip)
    }
}

function slackSend(message) {
    axios.post(slackWebhook, {
        text: message
    })
}