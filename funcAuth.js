let mybatisMapper = require('mybatis-mapper');
const crypto = require("crypto");
let fm = {language: 'sql', indent: '  '};
let pool = null
let jwt = require("jsonwebtoken");
const SECRET_KEY = '/dA43fnfe21Nme2ADR2jQ==';

//공통 함수용
var fc = require("./funcComm.js");
const { count } = require('console');

function getPassEncrypt(pass, user_id) {
    let passwd
    if (pass) {
        let shop_key = "pyungan"
        passwd = fc.hash("sha512", `${fc.md5(pass)}${shop_key}${user_id}`)
    }
    return passwd
}

//DB
function settingDb(poolConnect) {
    pool = poolConnect;

    //console.log("setting DB");

    mybatisMapper.createMapper(['./sql-auth.xml']);


    fc.settingDb(pool);
}
module.exports.settingDb = settingDb;

async function auth_login(req, res) {
	var sql = "";
	var param = {};
    var user_name = decodeURIComponent(req.body.user_name); if(user_name == null || user_name == "" || user_name == "undefined" || user_name == undefined) user_name = "";
    var pass_word = decodeURIComponent(req.body.pass_word); if(pass_word == null || pass_word == "" || pass_word == "undefined" || pass_word == undefined) pass_word = "";
    if(user_name == "" || pass_word == ""){
        res.set({
			'content-type': 'application/json'
		}).send(JSON.stringify({success:false, message:"mode is empty!", errorCode:-100, data:null}));
		return;
    }

    param.user_name = user_name;
    param.pass_word = pass_word;

    
	sql = mybatisMapper.getStatement('auth', 'auth_login', param, fm);
   
	var [row] = await pool.query(sql);
    // console.log(row);

    if(row.length == 0){
        res.set({
			'content-type': 'application/json'
		}).send(JSON.stringify({success:false, message:"You entered the wrong username.", errorCode:-100, data:null}));
		return;
    }
    const today = new Date().format("yyyy-mm-dd HH:MM:ss")
    var passwd =  getPassEncrypt(user_name, pass_word);
   console.log(passwd);
    if(row[0].pass_word == passwd)
    {
        const ip = req.clientIp.indexOf("::ffff:") >= 0 ? req.clientIp.slice("::ffff:")[1] : req.clientIp
        const data = {
            login_id: row[0].user_name,
            login_gb: "A",
            login_nm: row[0].full_name,
            login_sdate: today,
            reg_ip: ip,
           
        }
        const token = jwt.sign({
            admin_id: row[0].user_name,
            admin_nm: row[0].full_name,
            login_sdate: data.login_sdate,
            ip: data.reg_ip,
            admin_login_use: true
        }, SECRET_KEY, {
            algorithm: 'HS256',
            expiresIn: '24h'
        })
        
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify({success:true, message:"SUCCESS", errorCode:0, access_token: token, data: data}));
    }else{
        let js ={}
        res.set({
            'content-type': 'application/json'
        }).send(JSON.stringify({success:true, message:"Incorrect password", errorCode:0, data:js}));
    }

}
module.exports.auth_login =  auth_login;


