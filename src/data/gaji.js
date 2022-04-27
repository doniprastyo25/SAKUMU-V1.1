'use strict'
const db = require('./database').db
const date = require('date-and-time')

const getKaryawan = async function() {
    let tablekaryawan = `CREATE TABLE IF NOT EXISTS "DATAKARYAWAN" ("id" INTEGER, "kj" INTEGER, "nama" TEXT)`
    let tablejabatan = `CREATE TABLE IF NOT EXISTS "JABATAN" ("kj" INTEGER, "namajabatan" TEXT, "besarangaji" INTEGER)`
    let tunjanganpotongan = `CREATE TABLE IF NOT EXISTS "TUNJANGANPOTONGAN" ("id" INTEGER, "jtp" INTEGER, "besaran" INTEGER)`
    let gaji = `CREATE TABLE IF NOT EXISTS "PENGGAJIAN" ("kd" INTEGER, "id" INTEGER, "timestamp" TEXT, "besaran" INTEGER)`
    db.prepare(tablekaryawan).run()
    db.prepare(tablejabatan).run()
    db.prepare(tunjanganpotongan).run()
    db.prepare(gaji).run()
    
}

module.exports = {
    getKaryawan
}