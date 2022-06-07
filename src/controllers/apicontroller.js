'use strict'
const appNeraca = require('../data/neraca');
const inData = require('../data/inData');
const rupiah = require('rupiah-format');
const menu = require('../data/getMenu');

const getKasApi = async(req, res) => {
    try {
        await appNeraca.getLaporanLabarugi(function(data) {
            if (data.status === 'ok') {
                const dataIn = data.data.filter(item => item.kategori === "penerimaan");
                var finalIn = [];
                let totalIn = 0;
                for (let i = 0; i < dataIn.length; i++) {
                    finalIn.push({
                        sub:dataIn[i].sub,
                        dess:dataIn[i].dess,
                        total: rupiah.convert(dataIn[i].total)
                    })
                    totalIn += dataIn[i].total
                }
                const dataOut = data.data.filter(item => item.kategori === "pengeluaran");
                var finalOut =[];
                let totalOut = 0;
                for (let i = 0; i < dataOut.length; i++) {
                    finalOut.push({
                        sub:dataOut[i].sub,
                        dess:dataOut[i].dess,
                        total: rupiah.convert(dataOut[i].total)
                    })
                    totalOut += dataOut[i].total
                }
                const totalall = totalIn - totalOut;
                inData.getBank(function(kdata) {
                    let listkas = [];
                        for (let i = 0; i < kdata.qrows.length; i++) {
                            listkas.push({
                                idkas: kdata.qrows[i].id,
                                nkas: kdata.qrows[i].nama,
                                ckas: kdata.qrows[i].color
                            })                            
                        }
                    res.send({status:200,
                                penerimaan: finalIn,
                                total_penerimaan: rupiah.convert(totalIn),
                                pengeluaran: finalOut,
                                total_pengeluaran: rupiah.convert(totalOut),
                                total_all: rupiah.convert(totalall),
                                dkas: listkas
                            })
                })
            }
        })
    } catch (error) {
        res.send({status:500, msg:error})
    }
}

const APIInNoMenu = async(req, res) => {
    getmenu(function(listmenu) {
        const getsub = listmenu.in
        console.log(getsub.length);
        if (getsub.length == 0) {
            res.send({
                msg: 'no menu'
            })
        }else{
            res.send({
                getsub
            })
        }
    })
}

const APIgetpenerimaan = async (req, res) =>{
    try {
        const no = req.params.no;
        const getdate = req.params.date;
        // console.log(getdate);
        await inData.getData(no, getdate, function(data) {
            let listdata = [];
            for (let i = 0; i < data.rows.length; i++) {
                let time = data.rows[i].timestamp;
                let str = time.toString();
                let year = str.substring(0,4);
                let month = str.substring(4,6);
                let day = str.substring(6,8);
                let tanggal = day+"/"+month+"/"+year;
                listdata.push({
                    kd: data.rows[i].kd,
                    no: data.rows[i].no,
                    timestamp: data.rows[i].timestamp,
                    tanggal: tanggal,
                    uraian: data.rows[i].uraian,
                    satuan: data.rows[i].satuan,
                    satuanrp: rupiah.convert(data.rows[i].satuan),
                    jumlah: data.rows[i].jumlah,
                    total: data.rows[i].total,
                    totalrp: rupiah.convert(data.rows[i].total),
                    sumber: data.rows[i].sumber,
                    kas: data.rows[i].kas,
                    colors:data.rows[i].color,
                    nama :data.rows[i].nama,
                    indikatorkelas : data.rows[i].warna
                })              
            }
            inData.getBank(function (kdata) {
                let listkas = [];
                    for (let i = 0; i < kdata.qrows.length; i++) {
                        listkas.push({
                            idkas: kdata.qrows[i].id,
                            nkas: kdata.qrows[i].nama,
                            ckas: kdata.qrows[i].color
                        })                        
                    }
                    getmenu(function(listmenu) {
                        const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
                        const dbs = getsub[0].dbsiswa;
                        res.send({
                            data: listdata,
                            dkas: listkas,
                            listmenu,
                            dbs,
                        });
                    })
            })
        })
    } catch (error) {
        console.log(error);
    }
}

const APIgetpenerimaanall = async (req, res) =>{
    try {
        const no = req.params.no;
        await inData.getAllData(no, function(data) {
            let listdata = [];
            for (let i = 0; i < data.rows.length; i++) {
                let time = data.rows[i].timestamp;
                let str = time.toString();
                let year = str.substring(0,4);
                let month = str.substring(4,6);
                let day = str.substring(6,8);
                let tanggal = day+"/"+month+"/"+year;  
                listdata.push({
                    kd: data.rows[i].kd,
                    no: data.rows[i].no,
                    timestamp: data.rows[i].timestamp,
                    tanggal: tanggal,
                    uraian: data.rows[i].uraian,
                    satuan: data.rows[i].satuan,
                    satuanrp: rupiah.convert(data.rows[i].satuan),
                    jumlah: data.rows[i].jumlah,
                    total: data.rows[i].total,
                    totalrp: rupiah.convert(data.rows[i].total),
                    sumber: data.rows[i].sumber,
                    kas: data.rows[i].kas,
                    colors:data.rows[i].color,                
                    nama :data.rows[i].nama,
                    indikatorkelas :data.rows[i].warna 
                })             
            }
            inData.getBank(function(kdata) {
                let listkas = [];
                    for (let i = 0; i < kdata.qrows.length; i++) {
                        listkas.push({
                            idkas: kdata.qrows[i].id,
                            nkas: kdata.qrows[i].nama,
                            ckas: kdata.qrows[i].color
                        })                        
                    }
                    getmenu(function(listmenu) {
                        const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
                        const dbs = getsub[0].dbsiswa;
                        res.send({
                            data: listdata,
                            dkas: listkas,
                            listmenu,
                            dbs,
                        });
                    });
            })
        })
    } catch (error) {
        console.log(error);
    }
}

const APIinsearch = async (req, res) =>{
    const no = req.params.no;
    const keyword = req.body.search;
    console.log(keyword);
    if (keyword) {
        res.redirect(`/API/penerimaan/${no}/search?keyword=${keyword}`)
    }else{
        res.redirect(`/API/penerimaan/${no}`)

    }
}

const APIGetSearch = async (req, res) => {
    const no = req.params.no;
    const keyword = req.query.keyword;
    await inData.searchFilter(no, keyword, function(data) {
        let listdata = [];
        for(let i=0;i<data.length;i++){
            let time = data[i].timestamp;
            let str = time.toString();
            let year = str.substring(0,4);
            let month = str.substring(4,6);
            let day = str.substring(6,8);
            let tanggal = day+"/"+month+"/"+year;
            listdata.push({
                kd: data[i].kd,
                no: data[i].no,
                timestamp: data[i].timestamp,
                tanggal: tanggal,
                uraian: data[i].uraian,
                satuan: data[i].satuan,
                satuanrp: rupiah.convert(data[i].satuan),
                jumlah: data[i].jumlah,
                total: data[i].total,
                totalrp: rupiah.convert(data[i].total),
                sumber: data[i].sumber,
                kas: data[i].kas
            })
        }
        inData.getBank(function(kdata) {
            let listkas = [];
                for (let i = 0; i < kdata.qrows.length; i++) {
                    listkas.push({
                        idkas: kdata.qrows[i].id,
                        nkas: kdata.qrows[i].nama,
                        ckas: kdata.qrows[i].color
                    })                    
                }
                getmenu(function(listmenu) {
                    const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
                    const dbs = getsub[0].dbsiswa;
                    res.send({
                        data: listdata,
                        dkas: listkas,
                        listmenu,
                        dbs,
                    });
                })
        })
    })
}

// to render menu
async function getmenu(callback) {
    await menu.getMenu(function(data) {
        const inmenu = data.filter(item => item.kd === 1);
        const outmenu = data.filter(item => item.kd === 2);
        
        const allmenu = {
            in: inmenu,
            out: outmenu
        }
        callback(allmenu);
    });
}
module.exports ={
    getKasApi,
    getmenu,
    APIgetpenerimaan,
    APIgetpenerimaanall,
    APIinsearch,
    APIGetSearch,
    APIInNoMenu
}