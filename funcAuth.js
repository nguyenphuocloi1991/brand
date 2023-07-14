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

    mybatisMapper.createMapper(['./sql-auth.xml']);


    fc.settingDb(pool);
}
module.exports.settingDb = settingDb;

async function auth_get_list(req, res) {
	var sql = "";
	var param = {};

	sql = mybatisMapper.getStatement('auth', 'get_admin_info', param, fm);

	var [row] = await pool.query(sql);


	var js = row;

	res.set({
		'content-type': 'application/json'
	}).send(JSON.stringify({success:true, message:"SUCCESS", errorCode:0, data:js}));
	
}
module.exports.auth_get_list =  auth_get_list;