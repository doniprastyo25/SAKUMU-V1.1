'use strict';
const fs = require("fs");
const PDFDocument = require("pdfkit-table");
const PDFkitDoc = require('pdfkit');
const path = require('path');
const app_aktivasi = require('../data/aktivasi')
const appLogin = require('../data/login');
const appKas = require('../data/kas');
const appNeraca = require('../data/neraca');
const menu = require('../data/getMenu');
const rupiah = require('rupiah-format');
const inData = require('../data/inData.js');
const propil = require('../data/profilkop')
const date = require('date-and-time');
const axios = require('axios');
const isOnline = require('is-online');
const imgPath = path.dirname(process.cwd());

//GET
const getRoot = async (req,res) => {
    try {
        await getActive(function(status) {
            if (status == true) {
                res.redirect('/login');
            }else{
                res.redirect('/aktivasi');
            }
        });
    } catch (error) {
        console.log();
    }    
}

const getAktivasi = async (req,res) => {
    try {
        await getActive(function(status) {
            if (status == true) {
                res.redirect('/login');
            }else{
                res.render('./pages/aktivasi', {
                    title: 'Welcome',
                    layout: 'login-layout',
                    err: req.flash('err'),
                    off: req.flash('off')
                });
            }
        });
    } catch (error) {
        console.log(error);
    }    
}

const cektoken = async (req, res) => {
    console.log('tes');
}

const getLogin = async (req, res) => {
    try {
        await getActive(function(status) {
            if (status == true) {
                const cek = cekLogin(req.session.loggedIn);
                Promise.resolve(cek).then(result =>{
                    if (result == true) {
                        res.redirect('/dashboard')
                    }else{
                        req.session.destroy();
                        res.render('./pages/login', {
                            title: 'Login',
                            layout: 'login-layout'
                        });
                    }                
                });            
            }else{
                res.redirect('/aktivasi');
            }
        });
    } catch (error) {
        console.log(error);
    }    
}

const getDashboard = async(req,res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                appNeraca.getLaporanLabarugi(function(data) {
                    if (data.status === "ok") {
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
                        appKas.getSaldoKas(function(data) {
                          const inout = data['inout'];
                          const kas = data['kas'];
                          const newarray = [];
                          for (let i = 0; i < kas.length; i++) {
                              const totalkas = inout['in'+kas[i].id] - inout['out'+kas[i].id]
                              const newdata = {
                                  id: kas[i].id,
                                  nama: kas[i].nama,
                                  total: totalkas
                              }
                              newarray.push(newdata);
                          }
                          getmenu(function(listmenu) {
                                res.render('./pages/dashboard',{
                                  title: 'dashboard',
                                  page: 'dashboard',
                                  menu: 'dashboard',
                                  layout: 'main-layout',
                                  penerimaan: finalIn,
                                  total_penerimaan: totalIn,
                                  pengeluaran: finalOut,
                                  total_pengeluaran: totalOut, 
                                  kas: newarray,
                                  listmenu
                              })
                          });
                      });
                    }
                });
            }else{
                res.redirect('/logout');
            }
        }); 
    } catch (error) {
        console.log(error);
    }     
}

const getProfile = async (req,res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                // fungsi  getprofile
                propil.getProfile(function(data) {
                    const profil = data.row[0]
                    const logo = path.resolve(imgPath, './SAKUMU-BETA/img/logo/logo.png')
                    // console.log(logo);
                    getmenu(function(listmenu) {
                        res.render('./pages/profilsekolah',{
                            title: 'Profile',
                            page: 'profile',
                            menu: 'profile',
                            logo: logo,
                            layout: 'main-layout',
                            listmenu,
                            profil: profil
                        });
                    });
                })
            }else{
                req.session.destroy();
                res.redirect('/login');
            }
        });
    } catch (error) {
        console.log(error);
    }   
}

const getKas = async (req,res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {            
                appKas.getSaldoKas(function(data) {
                    const inout = data['inout'];
                    const kas = data['kas'];
                    const newarray = [];
                    for (let i = 0; i < kas.length; i++) {
                        const totalkas = inout['in'+kas[i].id] - inout['out'+kas[i].id]
                        const newdata = {
                            id: kas[i].id,
                            nama: kas[i].nama,
                            total: rupiah.convert(totalkas)
                        }
                        newarray.push(newdata);
                    }
            
                    getmenu(function(listmenu) {
                        res.render('./pages/kas',{
                            title: 'Kas',
                            page: 'kas',
                            menu: 'kas',
                            layout: 'main-layout',
                            kas: newarray,
                            listmenu,
                            succ: req.flash('cetaksuccess')
                        })
                    });
                });            
            }else{
                req.session.destroy();
                res.redirect('/login');
            }
        });
    } catch (error) {
        console.log(error);
    }    
}

const getArusKas = async (req,res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                appNeraca.getLaporanLabarugi(function(data) {
                    if (data.status === "ok") {
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
                        const totalall = totalIn - totalOut
                        inData.getBank(function (kdata) {
                            let listkas = [];
                              for (let i = 0; i < kdata.qrows.length; i++) {
                                listkas.push({
                                  idkas: kdata.qrows[i].id,
                                  nkas: kdata.qrows[i].nama,
                                  ckas: kdata.qrows[i].color
                                });        
                              }
                            getmenu(function(listmenu) {
                                res.render('./pages/aruskas',{
                                    title: 'Laba Rugi',
                                    page: 'aruskas',
                                    menu: 'aruskas',
                                    layout: 'settings-layout',
                                    listmenu,
                                    penerimaan: finalIn,
                                    total_penerimaan: rupiah.convert(totalIn),
                                    pengeluaran: finalOut,
                                    total_pengeluaran: rupiah.convert(totalOut),
                                    totalall: rupiah.convert(totalall),
                                    dkas: listkas, 
                                    succ: req.flash('cetaksuccess')
                                })
                            })
                        });
                    }
                });
            }else{
                res.redirect('/logout');
            }
        }); 
    } catch (error) {
        console.log(error);
    }       
}

const getArusKasTanggal = async (req,res) => {
    try {
        var kas = req.query.inpKas
        var startdate = req.query.startdate
        var enddate = req.query.enddate
        var mdate = startdate.split('-');
        var mtahun = mdate[0]
        var mbulan = mdate[1]
        var mtanggal = mdate[2]
        var nol = parseInt('0')
        var endjam = parseInt('246060')
        var starttgl = mtahun+mbulan+mtanggal+nol+nol+nol+nol+nol+nol
        var adate = enddate.split('-');
        var atahun = adate[0]
        var abulan = adate[1]
        var atanggal = adate[2]
        var endtgl =atahun+abulan+atanggal+endjam
        // console.log(kas);
        // console.log(starttgl);
        // console.log(endtgl);
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                appNeraca.getKasTanggalLaporanLabarugi(kas, starttgl, endtgl, function(data) {
                    if (data.status === "ok") {
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
                        const totalall = totalIn - totalOut
                        inData.getBank(function (kdata) {
                            let listkas = [];
                              for (let i = 0; i < kdata.qrows.length; i++) {
                                listkas.push({
                                  idkas: kdata.qrows[i].id,
                                  nkas: kdata.qrows[i].nama,
                                  ckas: kdata.qrows[i].color
                                });        
                              }
                            getmenu(function(listmenu) {
                                res.render('./pages/aruskas',{
                                    title: 'Laba Rugi',
                                    page: 'aruskas',
                                    menu: 'aruskas',
                                    layout: 'settings-layout',
                                    listmenu,
                                    penerimaan: finalIn,
                                    total_penerimaan: rupiah.convert(totalIn),
                                    pengeluaran: finalOut,
                                    total_pengeluaran: rupiah.convert(totalOut),
                                    totalall: rupiah.convert(totalall),
                                    dkas: listkas, 
                                    succ: req.flash('cetaksuccess')
                                })
                            })
                        });
                    }
                });
            }else{
                res.redirect('/logout');
            }
        }); 
    } catch (error) {
        console.log(error);
    }       
}

const getLogout = async(req,res) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error);
    }    
}

const getSync = async(req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                appNeraca.cekLaporanJson(function(data) {
                    if (data.status === 'no') {
                        req.flash(`null`, `data belum ada silahkan buat transaksi`)
                        res.redirect(`/app/sync`)
                    } else {
                        const appsekolah = data.data[0].appid
                        axios({
                            method:'get',
                            // url:`http://localhost:3123/API/cekSinkronisasi`,
                            url:`http://467a0269edbd.sn.mynetname.net:80/API/cekSinkronisasi`,
                            data: {appsekolah: appsekolah}
                        }).then(function(response) {
                            console.log(response.data.result.msg);
                            const hasil = response.data.result.msg
                            if (response.data.result.status == `ok`) {
                                req.flash(`ceksyncok`, `${hasil}`)
                                // res.redirect(`/app/sync`)
                            } else {
                                req.flash(`ceksyncno`, `${hasil}`)
                                // res.redirect(`/app/sync`)
                            }
                        }).catch(function(error) {
                            if (error.code == 'ECONNREFUSED') {
                                req.flash(`serveroff`, `server sedang offline`)
                                // res.redirect(`/app/sync`)
                            }
                        })
                    }
                    propil.getappid(function(data) {
                        // console.log(data);
                        if (data.status == 'ok') {
                            const terima = data.row.penerimaan
                            const listpenerimaan = []
                            let totalin = 0;
                            for (let i = 0; i < terima.length; i++) {
                                listpenerimaan.push({
                                    sub: terima[i].sub,
                                    dess: terima[i].dess,
                                    total: terima[i].total,
                                    totalRp: terima[i].totalRp
                                })    
                                totalin += terima[i].total  
                            }
                            // console.log(totalin);
                            const keluar = data.row.pengeluaran
                            const listpengeluaran = [];
                            let totalOut = 0;
                            for (let i = 0; i < keluar.length; i++) {
                                listpengeluaran.push({
                                    sub: keluar[i].sub,
                                    dess: keluar[i].dess,
                                    total: keluar[i].total,
                                    totalRp: keluar[i].totalRp
                                })
                                totalOut += keluar[i].total
                            }
                            const totalAll = totalin - totalOut
                            getmenu(function(listmenu) {
                                res.render('./pages/sync',{
                                    title: 'Sinkronisasi',
                                    page: 'sync',
                                    menu: 'sync',
                                    layout: 'main-layout',
                                    listmenu,
                                    syncalert: req.flash('syncsuccess'),
                                    ceksyncok: req.flash('ceksyncok'),
                                    ceksyncno: req.flash(`ceksyncno`),
                                    kosong: req.flash(`null`),
                                    offline: req.flash(`offline`),
                                    servoff: req.flash(`serveroff`),
                                    servoff1: req.flash(`serveroff1`),
                                    penerimaan: listpenerimaan,
                                    pengeluaran: listpengeluaran,
                                    total_penerimaan: rupiah.convert(totalin),
                                    total_pengeluaran: rupiah.convert(totalOut),
                                    totalAll: rupiah.convert(totalAll)
                                });
                            })
                        } else {
                            console.log('no');
                            getmenu(function(listmenu) {
                                res.render('./pages/sync',{
                                    title: 'Sinkronisasi',
                                    page: 'sync',
                                    menu: 'sync',
                                    layout: 'main-layout',
                                    listmenu,
                                    syncalert: req.flash('syncsuccess'),
                                    ceksyncok: req.flash('ceksyncok'),
                                    ceksyncno: req.flash(`ceksyncno`),
                                    kosong: req.flash(`null`),
                                    offline: req.flash(`offline`),
                                    servoff: req.flash(`serveroff`),
                                    servoff1: req.flash(`serveroff1`),    
                                });
                            })
                        }
                    })
                }) 
            }else{
                res.redirect('/logout');
            }            
        });
    } catch (error) {
        console.log(error);
    }
}

const cetakLaporan = async(req, res) => {
    try {
        //setting query
        var kas = req.query.inpKas
        var startdate = req.query.startdate
        var enddate = req.query.enddate
        var mdate = startdate.split('-');
        var mtahun = mdate[0]
        var mbulan = mdate[1]
        var mtanggal = mdate[2]
        var nol = parseInt('0')
        var endjam = parseInt('246060')
        var starttgl = mtahun+mbulan+mtanggal+nol+nol+nol+nol+nol+nol
        var adate = enddate.split('-');
        var atahun = adate[0]
        var abulan = adate[1]
        var atanggal = adate[2]
        var endtgl =atahun+abulan+atanggal+endjam
        // setting judul
        let setDate = ""
        const now = new Date();
        setDate = date.format(now, 'YYYYMMDDHHmmss');
        let str = setDate.toString();
        let year = str.substring(0,4);
        let month = str.substring(4,6);
        let day = str.substring(6,8);
        let jam = str.substring(8,10);
        let menit = str.substring(10,12);
        let detik = str.substring(13,15);
        let tgl = day+","+month+","+year+","+jam+"_"+menit+"_"+detik;
        let dog = new PDFkitDoc(); 
        let doc = new PDFDocument({ margin:20,startY:100, size: 'A4', });
        // file name
        doc.pipe(fs.createWriteStream(`./laporan/aruskas/aruskas ${tgl}.pdf`));
        console.log(kas);
        console.log(starttgl);
        console.log(endtgl);
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                // ambil data
                appNeraca.getKasTanggalLaporanLabarugi(kas, starttgl, endtgl, function(data) {
                    if (data.status === "ok") {
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
                        // console.log(finalIn.length);
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
                        const semua = finalIn.length + finalOut.length
                        // console.log(semua);
                        const totalall = totalIn - totalOut
                        inData.getBank(function (kdata) {
                            let listkas = [];
                              for (let i = 0; i < kdata.qrows.length; i++) {
                                listkas.push({
                                  idkas: kdata.qrows[i].id,
                                  nkas: kdata.qrows[i].nama,
                                  ckas: kdata.qrows[i].color
                                });        
                              }
                              // config pdfkit-table
                              const table1 = {
                                title: "PENERIMAAN",
                                subtitle: `laporan penerimaan`,
                                padding: 100,
                            headers: [
                                {label:"nomor", property:"sub", width: 120, renderer:null },
                                {label:"uraian", property:"dess", width:200, renderer:null},
                                {label:"total", property:"total", width:220, renderer:null}
                            ],
                            // complex data
                            datas: finalIn,
                            };
                              const table2 = {
                                title: "PENGELUARAN",
                                subtitle: `laporan pengeluaran`,
                                padding: 100,
                            headers: [
                                {label:"nomor", property:"sub", width: 120, renderer:null },
                                {label:"uraian", property:"dess", width:200, renderer:null},
                                {label:"total", property:"total", width:220, renderer:null}
                            ],
                            // complex data
                            datas: finalOut,
                            };
                            const table3 = {
                                headers:[
                                    {label:"Total KAS", property:"totalkas", width:320, renderer:null},
                                    {label:`${rupiah.convert(totalall)}`, property:"totalall", width:220, renderer:null}
                                ]
                            }
                            let imgPath = path.resolve('img', 'kopsurat.PNG');
                            console.log(imgPath);
                            doc.image(imgPath, {
                                fit: [527, 140],
                                align: 'center',
                                valign: 'top'
                              })
                              doc.fillColor('white')
                                .text('test'.slice(0, 199))
                              doc.table( table1, { 
                              // A4 595.28 x 841.89 (portrait) (about width sizes)
                              width: 700,
                              columnsSize: [ 120, 120, 500 ],
                                });
                            doc.text(`                                                      TOTAL PENERIMAAN                                                      ${rupiah.convert(totalIn)}`)
                            doc.table( table2, { 
                                // A4 595.28 x 841.89 (portrait) (about width sizes)
                                width: 700,
                                columnsSize: [ 120, 120, 500 ],
                            }); 
                            doc.text(`                                                      TOTAL PENGELUARAN                                                   ${rupiah.convert(totalOut)}`)
                            doc.fillColor('white')
                            .text(`test
                            
                            `.slice(0, 199))
                            doc.table( table3, { 
                                // A4 595.28 x 841.89 (portrait) (about width sizes)
                                width: 700,
                                margin: 20,
                                columnsSize: [ 120, 120, 500 ],
                            });
                            doc.font('Helvetica').text(` `)
                            doc.font('Helvetica').text(` `)
                            doc.font('Helvetica').text(` `)
                            if (semua >= 30) {
                                if (semua >= 37) {
                                    doc.font('Helvetica').text(`                                                                                                                                                                                            Ponorogo, ......................................`)
                                    doc.font('Helvetica').text(`      Mengetahui,                                                                                                                                                                           `)
                                    doc.font('Helvetica').text(`     Ketua Majelis                                                                            Kepala Sekolah                                                                           Bendahara`)
                                    doc.font('Helvetica').text(` `)
                                    doc.font('Helvetica').text(` `)
                                    doc.font('Helvetica').text(` `)
                                    doc.font('Helvetica').text(` `)
                                    doc.font('Helvetica').text(` `)
                                    doc.font('Helvetica').text(`Drs. Harry Sumaryanto                                                              .....................................                                                       ..............................................`)
                                } else {
                                    doc.addPage()
                                    doc.font('Helvetica').text(`                                                                                                                                                                                            Ponorogo, ......................................`)
                                    doc.font('Helvetica').text(`      Mengetahui,                                                                                                                                                                           `)
                                    doc.font('Helvetica').text(`     Ketua Majelis                                                                            Kepala Sekolah                                                                           Bendahara`)
                                    doc.font('Helvetica').text(` `)
                                    doc.font('Helvetica').text(` `)
                                    doc.font('Helvetica').text(` `)
                                    doc.font('Helvetica').text(` `)
                                    doc.font('Helvetica').text(` `)
                                    doc.font('Helvetica').text(`Drs. Harry Sumaryanto                                                              .....................................                                                       ..............................................`)
                                }
                            } else {
                                doc.font('Helvetica').text(`                                                                                                                                                                                            Ponorogo, ......................................`)
                                doc.font('Helvetica').text(`      Mengetahui,                                                                                                                                                                           `)
                                doc.font('Helvetica').text(`     Ketua Majelis                                                                            Kepala Sekolah                                                                           Bendahara`)
                                doc.font('Helvetica').text(` `)
                                doc.font('Helvetica').text(` `)
                                doc.font('Helvetica').text(` `)
                                doc.font('Helvetica').text(` `)
                                doc.font('Helvetica').text(` `)
                                doc.font('Helvetica').text(`Drs. Harry Sumaryanto                                                              .....................................                                                       ..............................................`)    
                            }
//                             // doc.text('This is a footer', 20, doc.page.height - 50, {lineBreak: false});
                                                        // end code
                            doc.end();
                            if (data.status == 'ok') {
                                req.flash('cetaksuccess', `laporan arus kas berhasil di cetak dengan nama file | aruskas ${tgl}.pdf |`)
                                res.redirect(`/aruskas`)
                            } else {
                                res.redirect(`/aruskas`)
                            }
                        });
                    }
                });
            }else{
                res.redirect('/logout');
            }
        }); 
    } catch (error) {
        console.log(error);
    }
}

const getCetakKwitansi = async(req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                getmenu(function(listmenu) {
                    res.render('./pages/cetak-kwitansi',{
                        title: 'cetakkwitansi',
                        page: 'cetakkwitansi',
                        dess: 'cetakkwitansi',
                        menu: 'cetakkwitansi',
                        layout: 'main-layout',
                        listmenu
                    });
                })
            }else{
                res.redirect('/logout');
            }            
        });
    } catch (error) {
        console.log(error);
    }
}

//POST
const postAktivasi = async (req,res) => {
    try {
        var kd_sekolah = req.body.kdsekolah;
        var kd_aktivasi = req.body.kdaktivasi;
        await app_aktivasi.submit(kd_sekolah, kd_aktivasi, function(data) {
            console.log(data);
            if (data.status === "ok") {
                res.redirect('/login');
            }else if (data.status === "no") {
                req.flash('err',data.msg);
                res.redirect('/aktivasi');
            }else if (data.status == "off") {
                req.flash(`off`, data.msg);
                res.redirect('/aktivasi')
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const postLogin = async (req,res) => {
    try {
        var username = req.body.inpUser;
        var password = req.body.inpPass;
        const result = await appLogin.Login(username, password);
        if(result['status'] === 'ok'){
            req.session.cookie.expires = new Date(Date.now() + 3600000);
            req.session.loggedIn = true;
            res.redirect('/dashboard');
        }else{
            res.redirect('/')
        }
    } catch (error) {
        console.log(error);
    }    
}

const postAddKas = async (req, res) => {
    var nama_kas = req.body.inpKas;
    var color = req.body.inpColor
    const cek = cekLogin(req.session.loggedIn);
    await Promise.resolve(cek).then(result =>{
        if (result == true) { 
            appKas.addKas(nama_kas,color, function(data) {
                if (data.status === "ok") {
                    res.redirect('/settings/kas');
                }
            });
        }else{
            res.redirect('/logout');
        }
    });
}

const postDelKas = async (req, res) => {
    var id = req.query.id;
    var nama = req.query.nama;
    const cek = cekLogin(req.session.loggedIn);
    await Promise.resolve(cek).then(result =>{
        if (result == true) { 

        }else{
            res.redirect('/logout');
        }
    });
}

const getlaporanjson = (req, res) => {
    const cek = cekLogin(req.session.loggedIn);
    Promise.resolve(cek).then(result =>{
        if (result == true) {
            (async () => {
                if (await isOnline() == false) {
                    req.flash(`offline`, `tidak ada koneksi internet`)
                    res.redirect(`/app/sync`)
                } else {
                    try {
                        var startdate = req.query.startdate
                        var enddate = req.query.enddate
                        var mdate = startdate.split('-');
                        var mtahun = mdate[0]
                        var mbulan = mdate[1]
                        var mtanggal = mdate[2]
                        var nol = parseInt('0')
                        var endjam = parseInt('246060')
                        var starttgl = mtahun+mbulan+mtanggal+nol+nol+nol+nol+nol+nol
                        var adate = enddate.split('-');
                        var atahun = adate[0]
                        var abulan = adate[1]
                        var atanggal = adate[2]
                        var endtgl =atahun+abulan+atanggal+endjam
                        appNeraca.getLaporanJson(starttgl, endtgl, function(data) {
                            if (data.status === `ok`) {
                                const dataIn = data.data.filter(item => item.kategori === "penerimaan");
                                var final = [];
                                for (let i = 0; i < dataIn.length; i++) {
                                    final.push({
                                        sub:dataIn[i].sub,
                                        kd: dataIn[i].kd,
                                        kategori: dataIn[i].kdIn,
                                        dess: dataIn[i].dess,
                                        total: dataIn[i].total,
                                        totalRp: rupiah.convert(dataIn[i].total),
                                        aplikasisekolah: dataIn[i].appid,
                                    })                    
                                }
                                const dataOut = data.data.filter(item => item.kategori === "pengeluaran");
                                for (let i = 0; i < dataOut.length; i++) {
                                    final.push({
                                        sub:dataOut[i].sub,
                                        kd: dataOut[i].kd,
                                        kategori: dataOut[i].kdOut,
                                        dess: dataOut[i].dess,
                                        total: dataOut[i].total,
                                        totalRp: rupiah.convert(dataOut[i].total),
                                        aplikasisekolah: dataOut[i].appid
                                    })                    
                                }
                                // console.log(final[0].aplikasisekolah);
                                axios({
                                    method:'get',
                                    // url:'http://localhost:3123/API/cekLaporan',
                                    // url:'http://192.168.151.31:3123/API/cekLaporan',
                                    url:'http://467a0269edbd.sn.mynetname.net:80/API/cekLaporan',
                                    data: {appsekolah: final[0].aplikasisekolah},
                                }).then(function(response) {
                                    console.log(response);
                                }).catch(function(error) {
                                    console.log(error.code);
                                    req.flash(`serveroff`, `server sedang offline`)
                                })
        
                                for (let i = 0; i < final.length; i++) {
                                    axios({
                                        method:'post',
                                        // url:'http://localhost:3123/API/postLaporan',
                                       // url:'http://192.168.151.31:3123/API/postLaporan',
                                        url:'http://467a0269edbd.sn.mynetname.net:80/API/postLaporan',
                                        data:{
                                            sub: final[i].sub,
                                            kd: final[i].kd,
                                            kategori: final[i].kategori,
                                            dess: final[i].dess,
                                            total: final[i].total,
                                            totalRp: final[i].totalRp,
                                            appsekolah: final[i].aplikasisekolah
                                        },
                                    }).then(function(response) {
                                        console.log(response);
                                    }).catch(function(error) {
                                    if (error.code == 'ECONNREFUSED') {
                                        req.flash(`serveroff`, `server sedang offline`)
                                    }
                                })                    
                                }
                                req.flash('syncsuccess', `data ${starttgl} - ${endtgl} telah disinkronkan silahkan cek kembali sinkronisasi dengan menekan tombol cek sinkron`)
                                res.redirect(`/app/sync`) 
                            }else{
                                req.flash(`null`, `data belum ada silahkan buat transaksi`)
                                res.redirect(`/app/sync`)
                            }
                        })
                    } catch (error) {
                        console.log(error.code);
                    }
                }
            })();
        } else {
            res.redirect('/logout');
        }
    })
}

const cekSinkron = async (req, res) => {
    (async () => {
        if (await isOnline() == false) {
            req.flash(`offline`, `tidak ada koneksi internet`)
            res.redirect(`/app/sync`)
        } else {
            try {
                const cek = cekLogin(req.session.loggedIn);
                await Promise.resolve(cek).then(result =>{
                    if (result == true) {
                        appNeraca.cekLaporanJson(function(data) {
                            if (data.status === 'no') {
                                req.flash(`null`, `data belum ada silahkan buat transaksi`)
                                res.redirect(`/app/sync`)
                            } else {
                                const appsekolah = data.data[0].appid
                                axios({
                                    method:'get',
                                    // url:`http://localhost:3123/API/cekSinkronisasi`,
                                    url:`http://467a0269edbd.sn.mynetname.net:80/API/cekSinkronisasi`,
                                    data: {appsekolah: appsekolah}
                                }).then(function(response) {
                                    console.log(response.data.result.msg);
                                    const hasil = response.data.result.msg
                                    if (response.data.result.status == `ok`) {
                                        req.flash(`ceksyncok`, `${hasil}`)
                                        res.redirect(`/app/sync`)
                                    } else {
                                        req.flash(`ceksyncno`, `${hasil}`)
                                        res.redirect(`/app/sync`)
                                    }
                                }).catch(function(error) {
                                    if (error.code == 'ECONNREFUSED') {
                                        req.flash(`serveroff`, `server sedang offline`)
                                        res.redirect(`/app/sync`)
                                    }
                                })
                            }
                        }) 
                    } else {
                        res.redirect('/logout')
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
    })();

}

//----------------------------------------------------//

//CHECK AKTIVASI
async function getActive(callback) {
    try {
        await app_aktivasi.check(function(data) {
            callback(data.active);
        });
    } catch (error) {
        console.log(error);
    }
}

//CHECK LOGIN
async function cekLogin(status) {
    try {
        if (status == true) {
            return true;
        }else{
            return false;
        }
    } catch (error) {
        console.log(error);
    }    
}

//MENU
async function getmenu(callback) {
    try {
        await menu.getMenu(function(data) {
            const inmenu = data.filter(item => item.kd === 1);
            const outmenu = data.filter(item => item.kd === 2);
            
            const allmenu = {
                in: inmenu,
                out: outmenu
            }
            callback(allmenu);
        });
    } catch (error) {
        console.log();
    }    
}

module.exports = {
    getRoot,
    getAktivasi,
    postAktivasi,
    getLogin,
    postLogin,
    getLogout,
    getDashboard,
    getProfile,
    getKas,
    getArusKas,
    getArusKasTanggal,
    postAddKas,
    postDelKas,
    getSync,
    getCetakKwitansi,
    cetakLaporan,
    cektoken,
    getlaporanjson,
    cekSinkron,
    // datasinkron
}