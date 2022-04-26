'use strict';
const axios = require('axios');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const Base64 = require('crypto-js/enc-base64')
const db = require('./database').db

const check = async (callback) => {
    try {
        const get = "SELECT *FROM APPCONFIG";
        const exe = db.prepare(get).get();
        if (exe) {
            const appid = exe.appid;
            const key = exe.key;
            const token = exe.token;
            const stamp = exe.timestamp;
            const activated_key = exe.activated;
            //-----
            const encryp = Base64.stringify(crypto.HmacSHA256("activated",appid+key+token+stamp));
            if (encryp === activated_key) {
                callback({active: true});
            }else{
                callback({active: false});
            }
        }else{
            callback({active: false});
        }        
    } catch (error) {
        console.log(error);
    }
}

const gettoken = async (callback) => {
    try {
        const get = `SELECT * FROM APPCONFIG`;
        const tok = db.prepare(get).get();
        if (tok) {
            const token = tok.token
            callback({status:'true', token: token})
            console.log(token);
        } else {
            callback({status:'error', token: error})
            console.log(error);
        }
    } catch (error) {
        
    }
}


const submit = async (kd_sekolah, kd_aktivasi, callback) => {
    try {
        await axios({
            method: 'post',
            // url: 'http://localhost:3123/api/aktivasi',
            url: 'http://467a0269edbd.sn.mynetname.net:80/api/aktivasi',
            // url: 'http://192.168.151.31:3123/api/aktivasi',
            data: {kd: 'sakumu_aktivasi'},
            headers: {'kd_sekolah':kd_sekolah, 'kd_aktivasi':kd_aktivasi},
            timeout: 30000
        }).then(function(response) {
            const res_data = response.data;
            //console.log(res_data.status);
            if (res_data.status === "ok") {
                const key = res_data.data.key;
                const token = res_data.data.token;
                const stamp = res_data.timestamp;
                const secret_key = "secret"+key+stamp;
                jwt.verify(token,secret_key, function(err, decode) {
                    if (err) {
                        callback({status: "no", msg: "invalid token"});
                    }else{
                        const activated = Base64.stringify(crypto.HmacSHA256("activated",decode.id+key+token+stamp));                    
                        const query = "INSERT INTO APPCONFIG (appid,key,token,activated,timestamp) VALUES ('"+decode.id+"','"+key+"','"+token+"','"+activated+"','"+stamp+"')";
                        try {
                            const exe = db.prepare(query).run();
                            if (exe.changes == 1) {
                                callback({status: "ok", msg: "aktivasi berhasil"});
                            }                            
                        } catch (error) { console.log(error) }
                    }
                })
            }else{
                
                //callback(res_data.data);
            }
        }).catch(function (error) {
            console.log(error.code);
            callback({status:'off', msg:'server offline'})
        });
    } catch (error) {
        console.log(error);
        // callback(error.response.data);
    }
}


module.exports = {
    check,
    submit,
    gettoken
}