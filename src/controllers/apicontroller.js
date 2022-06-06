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

const APIgetpenerimaan = async (req, res) =>{
    try {
      res.send({msg:'ok'})  
    } catch (error) {
        console.log(error);
    }
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
    APIgetpenerimaan
}