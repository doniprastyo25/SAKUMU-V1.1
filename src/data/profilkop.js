'use strict'
const db = require('./database').db

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

module.exports = {
    getProfile,
    postProfile,
    editProfile
}