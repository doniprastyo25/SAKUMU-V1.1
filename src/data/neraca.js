'use strict';
const db = require('./database').db

const getLaporanNeraca = async function(callback) {
    
}

const getLaporanLabarugi = async function(callback) {
    var queIn = `SELECT a.sub, a.dess, sum(total) as total
                FROM SUBMENU a, PENERIMAAN i
                WHERE a.kd = 1 and a.sub = i.kd 
                GROUP by a.sub`

    var queOut = `SELECT a.sub, a.dess, sum(total) as total
                FROM SUBMENU a, PENGELUARAN i
                WHERE a.kd = 2 and a.sub = i.kd 
                GROUP by a.sub`
    try {
        const statement = [queIn,queOut].map(sql => db.prepare(sql).all());
        const getIn = statement[0];
        const getOut = statement[1];

        getMenu(function(data_menu) {
            const menuIn = data_menu.filter(item => item.kd == 1);
            const menuOut = data_menu.filter(item => item.kd == 2);
            //---
            const finaldata = []
            for (let i = 0; i < menuIn.length; i++) {
                var cekData = getIn.filter(item => item.sub == menuIn[i].sub)[0]; 
                let total = 0;
                if (typeof cekData !== 'undefined') {
                    total = cekData.total
               }
                finaldata.push({
                    kategori: "penerimaan",
                    sub: menuIn[i].sub,
                    dess: menuIn[i].dess,
                    total
                })
            }
            for (let i = 0; i < menuOut.length; i++) {
                var cekData = getOut.filter(item => item.sub == menuOut[i].sub)[0]; 
                let total = 0;
                if (typeof cekData !== 'undefined') {
                     total = cekData.total
                }
                finaldata.push({
                    kategori: "pengeluaran",
                    sub: menuOut[i].sub,
                    dess: menuOut[i].dess,
                    total
                })
            }
            callback({
                status:"ok",
                data:finaldata
            });
        })
    } catch (error) {
        console.log(error);
    }
}

const getKasTanggalLaporanLabarugi = async function(kas, startdate, enddate, callback) {
    console.log(kas);
    if (kas == "semua") {
        var queIn = `SELECT a.sub, a.dess, SUM(total) as total
                    FROM SUBMENU a, PENERIMAAN i
                    WHERE a.kd = 1
                    AND a.sub = i.kd
                    AND i.timestamp >= ${startdate}
                    AND i.timestamp <= ${enddate}
                    GROUP by a.sub`

        var queOut = `SELECT a.sub, a.dess, SUM(total) as total
                    FROM SUBMENU a, PENGELUARAN i
                    WHERE a.kd = 2
                    AND a.sub = i.kd
                    AND i.timestamp >= ${startdate}
                    AND i.timestamp <= ${enddate}
                    GROUP by a.sub`
    }else{
        var queIn = `SELECT a.sub, a.dess, SUM(total) as total
                    FROM SUBMENU a, PENERIMAAN i
                    WHERE a.kd = 1
                    AND a.sub = i.kd
                    AND i.timestamp >= ${startdate}
                    AND i.timestamp <= ${enddate}
                    AND i.kas = '${kas}' 
                    GROUP by a.sub`

        var queOut = `SELECT a.sub, a.dess, SUM(total) as total
                    FROM SUBMENU a, PENGELUARAN i
                    WHERE a.kd = 2
                    AND a.sub = i.kd
                    AND i.timestamp >= ${startdate}
                    AND i.timestamp <= ${enddate}
                    AND i.kas = '${kas}' 
                    GROUP by a.sub`
    }

    try {
        const statement = [queIn,queOut].map(sql => db.prepare(sql).all());
        const getIn = statement[0];
        const getOut = statement[1];

        getMenu(function(data_menu) {
            const menuIn = data_menu.filter(item => item.kd == 1);
            const menuOut = data_menu.filter(item => item.kd == 2);
            //---
            const finaldata = []
            for (let i = 0; i < menuIn.length; i++) {
                var cekData = getIn.filter(item => item.sub == menuIn[i].sub)[0]; 
                let total = 0;
                if (typeof cekData !== 'undefined') {
                    total = cekData.total
               }
                finaldata.push({
                    kategori: "penerimaan",
                    sub: menuIn[i].sub,
                    dess: menuIn[i].dess,
                    total
                })
            }
            for (let i = 0; i < menuOut.length; i++) {
                var cekData = getOut.filter(item => item.sub == menuOut[i].sub)[0]; 
                let total = 0;
                if (typeof cekData !== 'undefined') {
                     total = cekData.total
                }
                finaldata.push({
                    kategori: "pengeluaran",
                    sub: menuOut[i].sub,
                    dess: menuOut[i].dess,
                    total
                })
            }
            callback({
                status:"ok",
                data:finaldata
            });
        })
    } catch (error) {
        console.log(error);
    }
}

const getAllCetak = async function(kas, startdate, enddate, callback) {
    const now = new Date();
    const setDate = date.format(now, 'YYYYMMDD');

    // let query = "SELECT *FROM PENERIMAAN WHERE kd="+no;
    let qkas = `SELECT * FROM KAS`;
    let query = `SELECT kd,no,timestamp,uraian,satuan,jumlah,total,sumber,kas,color,nama FROM PENERIMAAN INNER JOIN KAS ON kas = id`;
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

const getLaporanJson = async function(startdate, enddate, callback) {
    var queIn = `SELECT a.sub, i.kd, a.kd as kdIn, a.dess, sum(total) as total, c.appid
    FROM SUBMENU a, PENERIMAAN i, APPCONFIG c
    WHERE a.kd = 1 
    AND a.sub = i.kd 
    AND i.timestamp >= ${startdate}
    AND i.timestamp <= ${enddate}
    GROUP by a.sub
    `
    var queOut = `SELECT a.sub, i.kd, a.kd as kdOut, a.dess, sum(total) as total, c.appid
    FROM SUBMENU a, PENGELUARAN i, APPCONFIG c
    WHERE a.kd = 2 
    AND a.sub = i.kd 
    AND i.timestamp >= ${startdate}
    AND i.timestamp <= ${enddate}
    GROUP by a.sub`

    try {
        let queryin = db.prepare(queIn).all()
        let queryout = db.prepare(queOut).all()
        const finaldata = []
        for (let i = 0; i < queryin.length; i++) {
            finaldata.push({
                kategori: "penerimaan",
                sub: queryin[i].sub,
                kd: queryin[i].kd,
                kdIn: queryin[i].kdIn,
                dess: queryin[i].dess,
                total: queryin[i].total,
                appid: queryin[i].appid
            })
        }
        for (let i = 0; i < queryout.length; i++) {
            finaldata.push({
                kategori: "pengeluaran",
                sub: queryout[i].sub,
                kd: queryout[i].kd,
                kdOut: queryout[i].kdOut,
                dess: queryout[i].dess,
                total: queryout[i].total,
                appid: queryout[i].appid
            })
        }
        // console.log(finaldata.length);
        if (finaldata.length == 0) {
            callback({
                status:"no",
                msg:"data belum ada"
            })
        } else {
            callback({
                status:"ok",
                data:finaldata
            });
        }
        // console.log(finaldata);
    } catch (error) {
        console.log(error);
    }
}

const cekLaporanJson = async function(callback) {
    var queIn = `SELECT a.sub, i.kd, a.kd as kdIn, a.dess, sum(total) as total, c.appid
    FROM SUBMENU a, PENERIMAAN i, APPCONFIG c
    WHERE a.kd = 1 
    AND a.sub = i.kd 
    GROUP by a.sub
    `
    var queOut = `SELECT a.sub, i.kd, a.kd as kdOut, a.dess, sum(total) as total, c.appid
    FROM SUBMENU a, PENGELUARAN i, APPCONFIG c
    WHERE a.kd = 2 
    AND a.sub = i.kd 
    GROUP by a.sub`

    try {
        let queryin = db.prepare(queIn).all()
        let queryout = db.prepare(queOut).all()
        const finaldata = []
        for (let i = 0; i < queryin.length; i++) {
            finaldata.push({
                kategori: "penerimaan",
                sub: queryin[i].sub,
                kd: queryin[i].kd,
                kdIn: queryin[i].kdIn,
                dess: queryin[i].dess,
                total: queryin[i].total,
                appid: queryin[i].appid
            })
        }
        for (let i = 0; i < queryout.length; i++) {
            finaldata.push({
                kategori: "pengeluaran",
                sub: queryout[i].sub,
                kd: queryout[i].kd,
                kdOut: queryout[i].kdOut,
                dess: queryout[i].dess,
                total: queryout[i].total,
                appid: queryout[i].appid
            })
        }
        // console.log(finaldata.length);
        if (finaldata.length == 0) {
            callback({
                status:"no",
                msg:`data belum ada`
            })
        } else {
            callback({
                status:"ok",
                data:finaldata
            });
        }
        // console.log(finaldata);
    } catch (error) {
        console.log(error);
    }
}

function getMenu(callback) {
    const menu = `SELECT *FROM SUBMENU`
    try {
        const get = db.prepare(menu).all();
        callback(get);
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    getLaporanNeraca,
    getLaporanLabarugi,
    getKasTanggalLaporanLabarugi,
    getAllCetak,
    getLaporanJson,
    cekLaporanJson
}