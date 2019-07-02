const express = require('express')
const helmet = require('helmet')
const path = require('path')
const ejs = require('ejs')
const mysql = require('mysql')
const methodOverride = require('method-override')
const redis = require('redis')

const app = express()

// Middleware
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

// View Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// Database
const db = mysql.createConnection({
    host: 'kanehooper.ccavulbhh6hk.ap-southeast-2.rds.amazonaws.com',
    user: 'kanehooper',
    password: 'kanehooper',
    database: 'kanehooper'
})

db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('mySql Connected...')
})

// Create table
app.get('/createtable', (req, res) => {
    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))'
    db.query(sql, (err, result) => {
        if (err) throw err
        console.log(result)
        res.send('Posts table created')
    })
})

// Insert post 1
app.get('/addpost1', (req, res) => {
    let post = {title: 'Post One', body: 'This is post number one'}
    let sql = 'INSERT INTO posts SET ?'
    let query = db.query(sql, post, (err, result) => {
        if (err) throw err
        console.log(result)
        res.send('Post One Added')
    })
})

// Get posts
app.get('/getposts', (req, res) => {
    let sql = 'SELECT * FROM posts'
    db.query(sql, (err, result) => {
        if (err) throw err
        console.log(result)
        res.send(result)
    })
})

// Create Redis Client
let client = redis.createClient(6379, 'mywebcache.drqkcg.0001.apse2.cache.amazonaws.com')
client.on_connect('connect', () => {
    console.log('Connected to Redis..')
})

// Routes

app.get('/', (req, res) => {
    res.render('index')
}) 

app.listen(3000, () => console.log('Server listening on port 3000'))