var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var compression = require('compression');
const session = require('express-session');
var mysql = require("mysql2/promise");
var fs = require('fs');
var randomstring = require("randomstring");
var urlencode = require("urlencode");
var log4js = require("log4js");
require("date-util")
var multer = require("multer");
var cors = require("cors")
var upload = multer({ dest: 'html/uploads/' });

//설정 정보
const configFile = fs.readFileSync('./config.json', 'utf8');
const config = JSON.parse(configFile);

var requestIp = require('request-ip');

//express �ε�
var app = express();

//http ���� ���
app.use(compression({ filter: shouldCompress }));

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
}

//�⺻ dir �� html ������ ����
app.use(express.static(path.join(__dirname, 'html')));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: false }));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(session({
    secret: "/dA43fnfe21Nme2ADR2jQ==",
    resave: false,
    saveUninitialized: false
}))
app.use(cors())
//���� port ���� �� ����
app.listen(process.env.PORT || 3011, '0.0.0.0', function () {
    console.log('Server started: ' + (process.env.PORT || 3011));
})

app.use(requestIp.mw())

//�߰� �Լ�, ������ Ȯ���� ����
function getExtension(filename) {
    return filename.split('.').pop();
}

/*
DB ���� ����
*/

var pool = mysql.createPool(config.dbSetting);


pool.query("set session sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION'");



var funcauth = require("./funcAuth");
funcauth.settingDb(pool);

var funcuser = require("./funcUser");
funcuser.settingDb(pool)



app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.set('trust proxy', true);




var returnResult = function (err, res) {
    // ����� ������ ���� �����ϱ� ���� result ��ü ����
    var result = {};
    if (err) {
        //res.status(400);
        result.data = err.stack;
    } else {
        //res.status(200);
        result.data = res;
    }
    return result;
}




//php �� addSlashes ����
String.prototype.addSlashes = function () {
    //no need to do (str+'') anymore because 'this' can only be a string
    return this.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
};


//api ��� ����
//----------------------------------

app.get('/v1.0/auth/listUser', function (req, res) {
    funcauth.auth_get_list(req, res);
});


app.post('/v1.0/user/register', function (req, res) {
    funcuser.user_register(req, res);
});