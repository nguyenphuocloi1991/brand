let mybatisMapper = require('mybatis-mapper');
const crypto = require("crypto");
let fm = {language: 'sql', indent: '  '};
let pool = null
let jwt = require("jsonwebtoken");
const SECRET_KEY = '/dA43fnfe21Nme2ADR2jQ==';

//공통 함수용
var fc = require("./funcComm.js");

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

    mybatisMapper.createMapper(['./sql-user.xml']);


    fc.settingDb(pool);
}

function getPassEncrypt(pass, user_id) {
    let passwd
    if (pass) {
        let shop_key = "pyungan"
        passwd = fc.hash("sha512", `${fc.md5(pass)}${shop_key}${user_id}`)
    }
    return passwd
}

module.exports.settingDb = settingDb;

async function user_register(req, res) {
 
    var user_name = decodeURIComponent(req.body.user_name); if(user_name == null || user_name == "" || user_name == "undefined" || user_name == undefined) user_name = "";
    var pass_word = decodeURIComponent(req.body.pass_word); if(pass_word == null || pass_word == "" || pass_word == "undefined" || pass_word == undefined) pass_word = "";
    var full_name = decodeURIComponent(req.body.full_name); if(full_name == null || full_name == "" || full_name == "undefined" || full_name == undefined) full_name = "";
    var email = decodeURIComponent(req.body.email); if(email == null || email == "" || email == "undefined" || email == undefined) email = "";
    var phone = decodeURIComponent(req.body.phone); if(phone == null || phone == "" || phone == "undefined" || phone == undefined) phone = "";
    console.log(req.body);
    if(user_name == "" || pass_word == "" || full_name == "" || email == ""){
        res.set({
			'content-type': 'application/json'
		}).send(JSON.stringify({success:false, message:"mode is empty!", errorCode:-100, data:null}));
		return;
    }
    let hash = getPassEncrypt(user_name, pass_word);
   
	var sql = "";
	var param = {};
            param.user_name = user_name;
            param.pass_word = hash;
            param.full_name = full_name;
            param.email = email;
            param.phone = phone;
            param.status = 2;

	sql = mybatisMapper.getStatement('user', 'user_create', param, fm);

	var [row] = await pool.query(sql);
	var js = row;

	res.set({
		'content-type': 'application/json'
	}).send(JSON.stringify({success:true, message:"SUCCESS", errorCode:0, data:js}));
	
}
module.exports.user_register =  user_register;