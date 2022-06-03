'use strict';
const db = require('./database').db
const date = require('date-and-time');

const addData = async function (callback) {
    const getKls = "SELECT *FROM KELAS"
    const getKas = "SELECT *FROM KAS"
    try {
        const rows = db.prepare(getKls).all();
        const krows = db.prepare(getKas).all();
        getSumberDana(function(data) {
            return callback({status:"ok",sd:data,kls:rows, kas:krows});
        })
    } catch (error) {
        console.log(error);
    }
}

const submitNew = async function(no,tglfix,uraian,satuan,jumlah,dana,kas, callback){
    const total = parseInt(satuan)*jumlah;
    const now = new Date();
    // const timestamp = date.format(now, 'YYYYMMDDHHmmss');
    const timestamp = tglfix
    console.log(timestamp);

    let getNomax = "SELECT max(no) as no FROM PENERIMAAN WHERE kd="+no;
    let nomor = 1;
    try {
        const nomax = db.prepare(getNomax).get();
        if(nomax.no !== null){
            nomor = nomax.no + 1;
        }
        let query = "INSERT INTO PENERIMAAN (kd,no,timestamp,uraian,satuan,jumlah,total,sumber,kas) VALUES ("+no+","+nomor+","+timestamp+",'"+uraian+"','"+satuan+"','"+jumlah+"',"+total+",'"+dana+"','"+kas+"')";
        try {
            const pre = db.prepare(query);
            const insert = pre.run();
            if(insert.changes > 0){
                callback({status: "ok", msg: "sukses"});
                console.log('- Input data baru berhasil');
            }
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
}

const updateData = async function(no,id,tglfix,uraian,satuan,jumlah,dana,kas, callback) {
    const total = parseInt(satuan)*jumlah;
    const query = "UPDATE PENERIMAAN SET uraian='"+uraian+"', timestamp='"+tglfix+"', satuan="+satuan+", jumlah="+jumlah+", total="+total+", sumber='"+dana+"', kas='"+kas+"' WHERE kd="+no+" and timestamp="+id;
    //console.log(query);
    try {
        const pre = db.prepare(query);
        const upd = pre.run();
        if (upd.changes > 0) {
            console.log('- Data berhasil diperbarui');
            return callback({status: "ok"});
        }
    } catch (error) {
        console.log(error);
    }
    
}

const deleteData = async function(no,id, callback) {
    const query = "DELETE FROM PENERIMAAN WHERE kd="+no+" and timestamp="+id
    try {
        const pre = db.prepare(query);
        const del = pre.run();
        if (del.changes > 0) {
            console.log('- Data berhasil dihapus');
            return callback({status: "ok", msg:"sukses"});
        }
    } catch (error) {
        console.log(error);
    }
}

async function getSumberDana(callback) {
    const query = "SELECT *FROM SUMBERDANA order by id";
    try {
        const rows = db.prepare(query).all();
        return callback(rows);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addData,
    submitNew,
    updateData,
    deleteData
}