'use strict'
const db = require('./database').db
const date = require('date-and-time')

const getKaryawan = async function(callback) {
    // process fungsi buat tabel jika belum ada----------------------------------------
    let tablekaryawan = `CREATE TABLE IF NOT EXISTS "DATAKARYAWAN" ("id" INTEGER, "kj" INTEGER, "nama" TEXT)`
    let tablejabatan = `CREATE TABLE IF NOT EXISTS "JABATAN" ("kj" INTEGER, "namajabatan" TEXT, "besarangaji" INTEGER)`
    let tunjanganpotongan = `CREATE TABLE IF NOT EXISTS "TUNJANGANPOTONGAN" ("id" INTEGER, "jtp" INTEGER, "besaran" INTEGER)`
    let gaji = `CREATE TABLE IF NOT EXISTS "PENGGAJIAN" ("kd" INTEGER, "id" INTEGER, "timestamp" TEXT, "besaran" INTEGER)`
    db.prepare(tablekaryawan).run()
    db.prepare(tablejabatan).run()
    db.prepare(tunjanganpotongan).run()
    db.prepare(gaji).run()
    //end process---------------------------------------------------------------------- 
    
    // process ambil data karyawan
    let query = `SELECT id,d.kj,nama,namajabatan as jabatan
                    FROM DATAKARYAWAN d
                    INNER JOIN JABATAN j
                    ON d.kj = j.kj`
    let query1 = `SELECT kj,namajabatan,besarangaji
                    FROM JABATAN`
    try {
        const krows = db.prepare(query).all();
        const jrows = db.prepare(query1).all();
        // console.log(krows);
        return callback({krows, jrows})
    } catch (error) {
        console.log(error);
    }
    // end process
}

const getJabatan = async function(callback) {
    let query = `SELECT kj,namajabatan,besarangaji
                    FROM JABATAN`
    try {
        const jrows = db.prepare(query).all();
        return callback({jrows})
    } catch (error) {
        console.log(error);
    }
}

const addGuruKaryawan = async function(id, nama, jabatan, callback) {
    const cekid = `SELECT id FROM DATAKARYAWAN WHERE id=${id}`
    const query = `INSERT INTO DATAKARYAWAN (id,kj,nama) VALUES ('${id}','${jabatan}','${nama}')`
    const cek = db.prepare(cekid).all()
    console.log(cek.length);
    if (cek.length == 0) {
        try {
            const insert = db.prepare(query).run();
            if (insert.changes > 0) {
                callback({status: "ok"});
                // console.log('input berhasil');
            }
        } catch (error) {
            console.log('gagal');
        }
    }else{
        callback({status:'no', msg:'id sudah ada'})
        // console.log('input gagal');
    }
}

const updateKaryawan = async function(id, nama, jabatan, callback){
    // console.log(id, nama, jabatan);
    let queryupdate = `UPDATE DATAKARYAWAN SET kj="${jabatan}",nama="${nama}" WHERE id='${id}'`
    try {
        const krows = db.prepare(queryupdate).run();
        if (krows.changes > 0) {
            console.log('- data berhasil diperbaharui');
            return callback({status:'ok'})
        }else{
            return callback({status:'no'})
        }
    } catch (error) {
        // console.log(error);
    }

}

module.exports = {
    getKaryawan,
    getJabatan,
    addGuruKaryawan,
    updateKaryawan
}