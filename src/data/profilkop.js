'use strict'
const db = require('./database').db
const axios = require('axios');

const getProfile = async function(callback){
    const query = `SELECT * FROM PROFILS`
    try {
      const get = db.prepare(query).all();
    //   console.log(get);
      callback({row: get})
    } catch (error) {
        console.log(error);
        // if (error.code == 'SQLITE_ERROR') {
        //     db.exec(create)
        //     getProfile()
        // }
    }
}

const postProfile = async function(namasekolah, alamat, notelp, kepsek, callback){
    // console.log(namasekolah, alamat, notelp, kepsek);
    const id = 1
    const querycek = `SELECT * FROM PROFILS`
    const queryupdate = `UPDATE PROFILS SET ID='${id}', 
                                            NAMASEKOLAH='${namasekolah}', 
                                            ALAMATSEKOLAH='${alamat}', 
                                            NOTELP='${notelp}', 
                                            KEPALASEKOLAH='${kepsek}'`
    const querytambah = `INSERT INTO PROFILS (ID, NAMASEKOLAH, ALAMATSEKOLAH, NOTELP, KEPALASEKOLAH) 
                                        VALUES (${id},'${namasekolah}','${alamat}','${notelp}','${kepsek}')`
    const dicek = db.prepare(querycek).all()
    console.log(dicek.length);
    if (dicek.length >= 1) {
        const update = db.prepare(queryupdate).run();
        if (update.changes > 0) {
            callback({status:"updateok", msg:"data sekolah berhasil diedit"})
        }
    } else {
        const insert = db.prepare(querytambah).run();
        if (insert.changes > 0) {
            callback({status:"tambahok", msg:"data sekolah berhasil ditambahkan"})
            console.log('we did it');
        }
    }
}

const editProfile = async function(callback) {
    
}

const getappid = async function(callback) {
    const query = `SELECT * FROM APPCONFIG`
    try {
        const get = db.prepare(query).all();
        // console.log(get[0].appid);
        const target = get[0].appid
        axios({
            method:'get',
            url:`http://467a0269edbd.sn.mynetname.net:80/API/laporankas?kodesekolah=${target}`
        }).then(function(response) {
            callback({status:'ok', row: response.data})
        }).catch(function(error) {
            callback({status:'no', error})
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getProfile,
    postProfile,
    editProfile,
    getappid
}