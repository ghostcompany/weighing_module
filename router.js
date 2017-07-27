let Koa = require('koa');
let req = require('req');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let router = require('koa-router')();
let path = require("path");
let fs = require("fs");
let app = new Koa();
let cors = require('kcors');
app.use(cors({
    origin: "*",
    allowMethods: ['GET', 'POST']
}));
//router.get('/logout', logout);
router.get('/sso', sso);
router.get('/login', login);
router.get('/signup', signup);
router.get(/^\/local(?:\/|$)/, local);
router.get(/^\/cdn(?:\/|$)/, library);
router.get(/^\/(?:(?!(cdn|sso|local|login)).)*(?:\/|$)/, main);
app.use(router.routes());

var rolePlay = {
    'admin': {
        'home': 1,
        'login': 1,
        'penimbangan': 1
    },
    'user': {
        'home': 0,
        'login': 1,
        'penimbangan': 1
    },
    'guest': {

    }
};
var extFile = {
    '.html': "text/html",
    '.css': "text/css",
    '.js': "text/javascript"
};
var urlWindows = path.join(__dirname, '..', '..', '\\html\\www');
var urlHtml = path.join(__dirname, '..', '..', '\\html');

async function library(ctx) {
    var filename = path.join(urlHtml, ctx.url);
    var html = await fread(filename, 'utf8');
    ctx.set('Content-Type', 'text/css');
    ctx.body = html;
}

async function local(ctx) {
    var links = ctx.url.split('/');
    var ref = ctx.request.header.referer.split('/').slice(-1);
    var filename = path.join(urlWindows, '/' + ref + '/' + links[2]);
    var html = await fread(filename, 'utf8');
    ctx.set('Content-Type', extFile[path.extname(filename)]);
    ctx.body = html;
}

async function main(ctx) {
    var filename = path.join(urlWindows, ctx.url);
    if (fs.statSync(filename).isDirectory())
        filename += '/index.html';
    var html = await fread(filename, 'utf8');
    var token = ctx.cookies.get('token');
    if (token) {
        var decoded = jwt.verify(token, 'secret');
        var data = JSON.parse(decoded.data);
        console.log(rolePlay[data.role]);
        const n = ~~ctx.cookies.get('view') + 1;
        ctx.cookies.set('view', n);
        ctx.body = html;
    } else
        ctx.redirect('/login');
}

async function login(ctx) {
    var filename = path.join(urlWindows, ctx.url);
    if (fs.statSync(filename).isDirectory())
        filename += '/index.html';
    var html = await fread(filename, 'utf8');
    ctx.body = html;
}

async function signup(ctx) {
    var filename = path.join(urlWindows, ctx.url);
    if (fs.statSync(filename).isDirectory())
        filename += '/index.html';
    var html = await fread(filename, 'utf8');
    ctx.body = html;
}

async function sso(ctx) {
    var sql = ' SELECT id , CONVERT(COLUMN_JSON(doc) USING utf8) as docs';
    sql += ' FROM docs.roles';
    sql += ' WHERE COLUMN_GET(doc, "username" as char) ="' + ctx.query.username + '" ';
    var res = await req('http://localhost:8877/test?sql=' + escape(sql));
    var docs = JSON.parse(res);
    if (docs.length > 0) {
        var obj = JSON.parse(docs[0].docs);
        var res = await bcrypt.compare(ctx.query.password, obj.hash);
        if (res) {
            var token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: JSON.stringify({
                    'user': ctx.query.username,
                    'role': 'admin'
                })
            }, 'secret');
            ctx.cookies.set('token', token, {
                'maxAge': 10 * 60 * 1000
            });
            ctx.body = res.toString();
        } else
            ctx.body = res.toString();
    } else {
        ctx.body = 'false';
    }
}

async function logout(ctx) {
    const n = ~~ctx.cookies.get('view');
    ctx.body = n + ' views';
}

app.listen(4000);

let fread = function (filePath, encoding) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, encoding, function (err, data) {
            if (err) return reject(err) // rejects the promise with `err` as the reason
            resolve(data) // fulfills the promise with `data` as the value
        })
    })
}
