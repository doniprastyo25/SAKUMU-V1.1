'use strict';
const db = require('./database').db
const date = require('date-and-time');

const getData = async function(no,getdate, callback) {
    let setDate = ""
    if (typeof getdate !== 'undefined' && getdate !== '') {
        const strdate = getdate.split('-');
        const tahun = strdate[0];
        const bulan = strdate[1];
        const hari = strdate[2];
        setDate = tahun+bulan+hari;
    }else{
        const now = new Date();
        setDate = date.format(now, 'YYYYMMDD');
    }
    // let query = "SELECT *FROM PENGELUARAN WHERE kd="+no+" AND timestamp like '"+setDate+"%'";
    let qkas = `SELECT * FROM KAS`;
    let query = `SELECT kd,no,timestamp,uraian,satuan,jumlah,total,sumber,kas,color,nama FROM PENGELUARAN INNER JOIN KAS ON kas = id WHERE kd=${no} AND timestamp like '${setDate}%'`;
    try {
        const qrows = db.prepare(qkas).all();
        const rows = db.prepare(query).all();
        const getTahun = setDate.substring(0,4);
        const getBulan = setDate.substring(4,6);
        const getHari = setDate.substring(6,8);
        const dateValue = getTahun+"-"+getBulan+"-"+getHari;
        callback({qrows,rows,filter: dateValue});
    } catch (error) {
        console.log(error);
    }
}

const getAllData = async function(no, callback) {
    const now = new Date();
    const setDate = date.format(now, 'YYYYMMDD');

    // let query = "SELECT *FROM PENGELUARAN WHERE kd="+no;
    let qkas = `SELECT * FROM KAS`;
    let query = `SELECT kd,no,timestamp,uraian,satuan,jumlah,total,sumber,kas,color,nama FROM PENGELUARAN INNER JOIN KAS ON kas = id WHERE kd='${no}'`;
    try {
        const qrows = db.prepare(qkas).all();
        const rows = db.prepare(query).all();
        const getTahun = setDate.substring(0,4);
        const getBulan = setDate.substring(4,6);
        const getHari = setDate.substring(6,8);
        const dateValue = getTahun+"-"+getBulan+"-"+getHari;
        return callback({qrows,rows,filter: dateValue});
    } catch (error) {
        console.log(error);
    }
}

const getBank = async function(callback) {
    let qkas = `SELECT * FROM KAS`;
    try {
      const qrows = db.prepare(qkas).all();
      return callback({qrows})
    } catch (error) {
      console.log(error);
    }
  }

const tunggakan = async function(no,month, callback) {
    let filter_month = ""
    if (typeof month === 'undefined') {
        const now = new Date();
        filter_month = date.format(now, 'YYYYMM');          
    }else{
        filter_month = month.replaceAll("-","")
    }

    var bayar = "SELECT *FROM PENGELUARAN WHERE kd="+no+" AND timestamp like '"+filter_month+"%' order by uraian"
    var siswa = "SELECT a.nis, a.nama, b.nama as kelas FROM SISWA a, KELAS b WHERE a.kelas = b.kd"

    try {
        const list_siswa = db.prepare(siswa).all();
        const list_bayar = db.prepare(bayar).all();

        let nis_bayar = []
        for (let i = 0; i < list_bayar.length; i++) {
            const uraian = list_bayar[i].uraian;
            const get_nis = uraian.split(',')[0]
            nis_bayar.push(get_nis);
        }

        let tunggakan_siswa = [];
        for (let i = 0; i < list_siswa.length; i++) {
            const nis = list_siswa[i].nis;
            const filter = nis_bayar.filter(item => item === nis);
            if (filter.length == 0) {
                tunggakan_siswa.push(list_siswa[i]);
            }
        }

        var get_year = filter_month.substring(0,4);
        var get_month = filter_month.substring(4,6);
        var set_filter = get_year+"-"+get_month;
        callback({status: "ok",list:tunggakan_siswa, filter: set_filter});
    } catch (error) {
        console.log(error);
    }
}

const getEdit = async function(no,id,callback) {
    // let query = "SELECT *FROM PENGELUARAN WHERE kd="+no+" AND timestamp="+id;
    let query = `SELECT kd,no,timestamp,uraian,satuan,jumlah,total,id,kas,color,nama FROM PENGELUARAN INNER JOIN KAS ON kas = id WHERE kd=${no} AND timestamp=${id}`;
    try {
        const row = db.prepare(query).get();
        callback(row)
    } catch (error) {
        console.log(error);
    }
}

const searchFilter = async function(no,keyword,callback) {
    const query = "SELECT *FROM PENGELUARAN WHERE kd="+no+" AND uraian like '%"+keyword+"%' order by uraian";
    try {        
        const rows = db.prepare(query).all();
        return callback(rows);
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

async function buildPDFAll(no, startdate, enddate, callback) {
    let query = `SELECT kd,no,timestamp,uraian,satuan,jumlah,total,sumber,kas,color,nama 
    FROM PENGELUARAN
    INNER JOIN
    KAS ON KAS = id
    WHERE kd=${no}
    AND timestamp >=${startdate}
    AND timestamp <=${enddate}`;
    try {
        const rows = db.prepare(query).all();
        return callback({rows, status:'ok'})
    } catch (error) {
        console.log(error);
    }
}

async function cetakKwitansi(no,id,callback) {
    let query = `SELECT i.kd,i.no,i.timestamp,i.uraian,i.satuan,i.jumlah,i.total,i.sumber,k.id,kas,k.color,k.nama,sub,dess,s.kd
    FROM PENGELUARAN i
    INNER JOIN KAS k
    ON kas = id
    INNER JOIN SUBMENU s
    ON sub = i.kd
    WHERE i.kd = ${no}
    AND s.kd = 2
    AND i.timestamp=${id}`;
    try {
        const row = db.prepare(query).get();
        getSumberDana(function(data) {
            return callback({field:row,sd:data, status:'ok', msg:'success'});
        })
    } catch (error) {
        console.log(error);
        return callback({status:'no', msg:'error'})
    }
}

module.exports = {
    getData,
    getAllData,
    tunggakan,
    getEdit,
    searchFilter,
    getBank,
    buildPDFAll,
    cetakKwitansi
}