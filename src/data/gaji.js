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
    let query = `SELECT id,nama,namajabatan as jabatan
                    FROM DATAKARYAWAN d
                    INNER JOIN JABATAN j
                    ON d.kj = j.kj`
    try {
        const krows = db.prepare(query).all();
        return callback({krows})
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

module.exports = {
    getKaryawan,
    getJabatan
}