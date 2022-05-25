'use strict';
const fs = require("fs");
const PDFDocument = require("pdfkit-table");
const PDFkitDoc = require('pdfkit')
const outData = require('../data/outData.js');
const outNew = require('../data/outNew.js');
const outGaji = require('../data/gaji');
const rupiah = require('rupiah-format');
const replaceAll = require('replaceall');
const menu = require('../data/getMenu');
const date = require('date-and-time');
const path = require('path');

// getmenu is dinamic sidebar loaded every menu in each function
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

//---

// loaded blank page pengeluaran -> pages/out-menu-null
const noMenu = async (req,res) => {
    getmenu(function(listmenu) {
        res.render('./pages/out-menu-null',{
            title: 'Pengeluaran',
            page: 'pengeluaran',
            menu: 'pengeluaran',
            layout: 'main-layout',
            listmenu    
        });
    });

}


const get = async (req,res) => {
    const no = req.params.no;
    const getdate = req.query.date;
    const result = await outData.getData(no,getdate,function(data) {
        let listdata = [];
        for(let i=0;i<data.rows.length;i++){
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
                colors: data.rows[i].color,
                nama: data.rows[i].nama
            })
        }

        outData.getBank(function (kdata) {
            let listkas = [];
              for (let i = 0; i < kdata.qrows.length; i++) {
                listkas.push({
                  idkas: kdata.qrows[i].id,
                  nkas: kdata.qrows[i].nama,
                  ckas: kdata.qrows[i].color
                });        
              }
              getmenu(function(listmenu) {
                  const getsub = listmenu.out.filter(item => item.sub === parseInt(no));
                  const dbs = getsub[0].dbsiswa;
                  res.render('./pages/pengeluaran',{
                      title: getsub[0].nama,
                      dess: getsub[0].dess,
                      page: '2'+no,
                      menu: 'pengeluaran',
                      layout: 'main-layout',
                      sub: no,
                      data: listdata,
                      dkas: listkas,
                      listmenu,
                      dbs,
                      filter: data.filter,
                      msg: req.flash('msg'),
                      succ: req.flash('cetakallsuccess'),
                      err: req.flash('kwitansierror'),
                      laporansucc: req.flash('kwitansisuccess')
                  });
              })
        });
    });
    return result
}

const getAll = async (req, res) => {
    const no = req.params.no;    
    const result = await outData.getAllData(no,function(data) {
        let listdata = [];
        for(let i=0;i<data.rows.length;i++){
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
                colors: data.rows[i].color,
                nama: data.rows[i].nama
            })
        }

        outData.getBank(function (kdata) {
            let listkas = [];
              for (let i = 0; i < kdata.qrows.length; i++) {
                listkas.push({
                  idkas: kdata.qrows[i].id,
                  nkas: kdata.qrows[i].nama,
                  ckas: kdata.qrows[i].color
                });        
              }
              getmenu(function(listmenu) {
                  const getsub = listmenu.out.filter(item => item.sub === parseInt(no));
                  const dbs = getsub[0].dbsiswa;
                  res.render('./pages/pengeluaran',{
                      title: getsub[0].nama,
                      dess: getsub[0].dess,
                      page: '2'+no,
                      menu: 'pengeluaran',
                      layout: 'main-layout',
                      sub: no,
                      data: listdata,
                      dkas: listkas,
                      listmenu,
                      dbs,
                      filter: data.filter,
                      msg: req.flash('msg'),
                      succ: req.flash('cetakallsuccess'),
                      err: req.flash('kwitansierror'),
                      laporansucc: req.flash('kwitansisuccess')
                  });
              })
        });
    });
    return result
}

const getTunggakan = async (req, res) => {
    try {
        const no = req.params.no;
        const month = req.query.filter;
        await outData.tunggakan(no,month,function(data) {
            if (data.status === "ok") {
                getmenu(function(listmenu) {
                    const getsub = listmenu.out.filter(item => item.sub === parseInt(no));
                    const dbs = getsub[0].dbsiswa;
                    res.render('./pages/tunggakan-siswa',{
                        title: getsub[0].dess,
                        subtitle: 'Daftar siswa yang belum mendapatkan',
                        page: '2'+no,
                        menu: 'pengeluaran',
                        layout: 'main-layout',
                        sub: no,
                        listmenu,
                        list: data.list,
                        filter: data.filter
                    });
                });
            };
        });
    } catch (error) {
        console.log(error);
    }
}

const outSearch = async (req,res) => {
    const no = req.params.no;
    const keyword = req.body.search;
    if (keyword) {
        res.redirect("/pengeluaran/"+no+"/search?keyword="+keyword);
    }else{
        res.redirect("/pengeluaran/"+no);
    }
}

const getSearch = async (req,res) => {
    const no = req.params.no;
    const keyword = req.query.keyword;
    await outData.searchFilter(no,keyword, function(data) {
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

        outData.getBank(function (kdata) {
            let listkas = [];
              for (let i = 0; i < kdata.qrows.length; i++) {
                listkas.push({
                  idkas: kdata.qrows[i].id,
                  nkas: kdata.qrows[i].nama,
                  ckas: kdata.qrows[i].color
                });        
              }
              getmenu(function(listmenu) {
                  const getsub = listmenu.out.filter(item => item.sub === parseInt(no));
                  const dbs = getsub[0].dbsiswa;
                  res.render('./pages/pengeluaran',{
                      title: getsub[0].nama,
                      dess: getsub[0].dess,
                      page: '1'+no,
                      menu: 'pengeluaran',
                      layout: 'main-layout',
                      sub: no,
                      data: listdata,
                      dkas:listkas,
                      listmenu,
                      dbs,
                      currentdate: data.filter,
                      filter: '',
                      msg: req.flash('msg'),
                      succ: req.flash('cetakallsuccess'),
                      laporansucc: req.flash('kwitansisuccess')
                  });
              })
        })
    });
}

const cetakAll = async (req, res, next) => {
    const no = req.params.no
    // setting query
    let startdate = req.query.startdate
    let enddate = req.query.enddate
    let mdate = startdate.split('-')
    let mtahun = mdate[0]
    let mbulan = mdate[1]
    let mtanggal = mdate[2]
    let nol = parseInt('0')
    let endjam = parseInt('246060')
    let starttgl = mtahun+mbulan+mtanggal+nol+nol+nol+nol+nol+nol
    let adate = enddate.split('-')
    let atahun = adate[0]
    let abulan = adate[1]
    let atanggal = adate[2]
    let endtgl = atahun+abulan+atanggal+endjam
    // setting tanggal nama file
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
    doc.pipe(fs.createWriteStream(`./laporan/pengeluaran/pengeluaran ${tgl}.pdf`));
    await outData.buildPDFAll(no,starttgl,endtgl, function(data) {
        let listbukti = [];
        for (let i = 0; i < data.rows.length; i++) {
            let time = data.rows[i].timestamp;
            let str = time.toString();
            let year = str.substring(0,4);
            let month = str.substring(4,6);
            let day = str.substring(6,8);
            let tanggal = day+"/"+month+"/"+year;
            listbukti.push({
                no:data.rows[i].no,
                tanggal:tanggal,
                uraian:data.rows[i].uraian,
                satuan:data.rows[i].satuan,
                jumlah:data.rows[i].jumlah,
                total:data.rows[i].total,
            })
        }
        console.log(listbukti);
        const table = {
            title: "Laporan Keuangan",
            subtitle: `laporan pengeluaran`,
            padding: 100,
        headers: [
          { label:"no", property: 'no', width: 30, renderer: null },
          { label:"tanggal", property: 'tanggal', width: 90, renderer: null }, 
          { label:"uraian", property: 'uraian', width: 200, renderer: null }, 
          { label:"satuan", property: 'satuan', width: 80, renderer: null }, 
          { label:"jumlah", property: 'jumlah', width: 50, renderer: null }, 
          { label:"total", property: 'total', width: 80, renderer: null }, 
        ],
        // complex data
        datas: listbukti,
          };
          let imgPath = path.resolve('img', 'kopsurat.PNG');
          console.log(imgPath);
          doc.image(imgPath, {
              fit: [527, 140],
              align: 'center',
              valign: 'top'
            })
            doc.fillColor('white')
              .text('test'.slice(0, 199))
            doc.table( table, { 
            // A4 595.28 x 841.89 (portrait) (about width sizes)
            width: 700,
            columnsSize: [ 100, 100, 500 ],
          }); 
          // end code
          doc.end();
          if (data.status == 'ok') {
              req.flash('cetakallsuccess', `laporan pengeluaran berhasil dicetak dengan nama file | pengeluaran ${tgl}.pdf |`)
              res.redirect(`/pengeluaran/${no}`)
            } else {
                res.redirect(`/pengeluaran/${no}`)
          }
    })
      next();
}

const cetakDetail = async (req, res, next) => {
    const no = req.params.no
    const id = req.query.id
    // const kd = req.query.kd
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
    let doc = new PDFDocument({ margin:20,startY:100, size: 'A5', layout:'landscape'});
    // file name
    doc.pipe(fs.createWriteStream(`./laporan/kwitansi/pengeluaran/kwitansi ${tgl}.pdf`));
    await outData.cetakKwitansi(no, id, function (data) {
        const time = data.field.timestamp;
        let str = time.toString();
        let year = str.substring(0,4);
        let month = str.substring(4,6);
        let day = str.substring(6,8);
        let jam = str.substring(8,10);
        let menit = str.substring(10,12);
        let detik = str.substring(12,14);
        let tanggal = day+"/"+month+"/"+year+" "+jam+":"+menit+":"+detik;
        const table1 = {
            title: "Bukti Pembayaran",
            padding: 100,
        headers: [
            {label:"Uraian", property:'uraian', width:200, headerColor:'white', renderer:null},
            {label:`${data.field.uraian}`, property:"uraian",headerColor:'white', width:320, renderer:null}
        ]
        };
        const table2 = {
            padding: 100,
        headers: [
            {label:"Tanggal", property:'Satuan', width:200, headerColor:'white', renderer:null},
            {label:`${tanggal}`, property:'tanggal', width:320, headerColor:'white', renderer:null}
        ]
        };
        const table3 = {
            padding: 100,
        headers: [
            {label:"Satuan", property:'Satuan', width:200, headerColor:'white', renderer:null},
            {label:`${rupiah.convert(data.field.satuan)}`, property:"uraian",headerColor:'white', width:187, renderer:null},
            {label:`Jumlah`, property:`jumlah`, width:70, headerColor:`white`, renderer:null},
            {label:`${data.field.jumlah}`, width:64, headerColor:`white`, renderer:null}
        ]
        };
        const table4 = {
            padding: 100,
        headers: [
            {label:"Total", property:'total', width:200, headerColor:'white', renderer:null},
            {label:`${rupiah.convert(data.field.total)}`, property:'tot', width:320, headerColor:'white', renderer:null}
        ]
        };
        const table6 = {
            padding: 100,
            headers: [
                {label:"Kas", property:'kas', width:200, headerColor:'white', renderer:null},
                {label:`${data.field.nama}`, width:320, headerColor:`white`, renderer:null}
            ]
        }
        const table7 = {
            padding: 100,
            headers: [
                {label:"Pembayaran", property:'kas', width:200, headerColor:'white', renderer:null},
                {label:`${data.field.dess}`, width:320, headerColor:`white`, renderer:null}
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
        doc.table(table1, {
            width: 700,
            margin: 20,
            columnsSize: [120, 120, 500]
        })
        doc.table(table2, {
            width:700,
            margin:20,
            columnsSize: [120,120,500]
        })
        doc.table(table3, {
            width:700,
            margin:20,
            columnsSize: [120,120,500]
        })
        doc.table(table4, {
            width:700,
            margin:20,
            columnsSize: [120,120,500]
        })
        doc.table(table6, {
            width:700,
            margin:20,
            columnsSize: [120,120,500]
        })
        doc.table(table7, {
            width:700,
            margin:20,
            columnsSize: [120,120,500]
        })
        // end code
        doc.end();
        if (data.status == 'ok') {
            req.flash('kwitansisuccess', `kwitansi ${data.field.dess} ${data.field.uraian} telah tercetak dengan nama file | kwitansi ${tgl}.pdf |pada folder SAKUMU-BETA-APP/kwitansi/pengeluaran/`);
            res.redirect(`/pengeluaran/${no}`)
        }else{
            req.flash('kwitansierror', data.msg);
        }
    })
    next();
}

const addNew = async (req, res) => {
    const no = req.params.no;
    await outNew.addData(function(data) {
        if (data.status === "ok") {
            getmenu(function(listmenu) {
                const getsub = listmenu.out.filter(item => item.sub === parseInt(no));
                const dbs = getsub[0].dbsiswa;
                if (dbs == 0) {
                    res.render('./pages/out-tambah',{
                        title : 'Input Baru',
                        subtitle: getsub[0].nama,
                        page: '2'+no,
                        menu: 'pengeluaran',
                        layout: 'main-layout',
                        sub: no,
                        listmenu,
                        kas:data.kas,
                        sd:data.sd
                    });
                }else if (dbs == 1) {
                    res.render('./pages/out-tambah-dbs',{
                        title: 'Input Baru',
                        subtitle: getsub[0].nama,
                        page: '1'+no,
                        menu: 'pengeluaran',
                        layout: 'main-layout',
                        sub: no,
                        listmenu,
                        kas:data.kas,
                        sd:data.sd,
                        kelas:data.kls,
                        err: req.flash('err')
                    })
                }
            })
        }
    })

}

const getNewsubmit = async (req,res) => {
    const no = req.params.no
    const uraian = req.body.inpUraian;
    const satuanrp = req.body.inpSatuan;
    const satuan = replaceAll(".","", satuanrp);
    const jumlah = req.body.inpJumlah;
    const dana = req.body.inpSDana;
    const kas = req.body.inpKas;
    if (typeof uraian !== "undefined") {
        const result = await outNew.addNew(no,uraian,satuan,jumlah,dana,kas, function(data) {
            if(data['status'] === 'ok'){
                res.redirect(301,'/pengeluaran/'+no);
            }
        });
        return result;
    }else{
        req.flash('err','Pastikan kelas dan nama siswa tidak kosong!');
        res.redirect('/pengeluaran/'+no+'/add')
    }
}

const edit = async (req,res) => {
    const no = req.params.no
    const id = req.query.id
    const result = await outData.getEdit(no,id,function(data) {
        outData.getBank(function (kdata) {
            let listkas = [];
              for (let i = 0; i < kdata.qrows.length; i++) {
                listkas.push({
                  idkas: kdata.qrows[i].id,
                  nkas: kdata.qrows[i].nama,
                  ckas: kdata.qrows[i].color
                });        
              }
              getmenu(function(listmenu) {
                  const getsub = listmenu.out.filter(item => item.sub === parseInt(no));
                  res.render('./pages/out-edit',{
                      title : 'Edit',
                      subtitle: getsub[0].dess,
                      page: '1'+no,
                      menu: 'pengeluaran',
                      layout: 'main-layout',
                      sub: no,
                      data,
                      dkas: listkas,
                      listmenu
                  });
              })
        });
    });
    return result;
}

const update = async (req, res) => {
    const no = req.params.no;
    const id = req.query.id;
    const uraian = req.body.inpUraian;
    const satuanrp = req.body.inpSatuan;
    const satuan = replaceAll(".","", satuanrp)
    const jumlah = req.body.inpJumlah;
    const dana = req.body.inpSDana;
    const kas = req.body.inpKas;
    const result = await outNew.updateData(no,id,uraian,satuan,jumlah,dana,kas, function(data) {
        if(data['status'] === 'ok'){
            res.redirect(301,'/pengeluaran/'+no);
        }
    });
    return result;
}

const getDelete = async (req,res) => {
    const no = req.params.no;
    const id = req.query.id;
    const result = await outNew.deleteData(no,id, function(data) {
        if(data['status'] === 'ok'){
            res.redirect(301,'/pengeluaran/'+no);
        }
    });
    return result;
}

// logic penggajian------------------------------------------------------
const getGuruKaryawan = async (req, res, next) =>{
    getmenu(function(listmenu) {
        outGaji.getKaryawan(function(dkaryawan) {
            // console.log(dkaryawan.jrows);
            res.render('./pages/gj-datakaryawan',{
                title: 'data karyawan',
                page: 'gj',
                dess: 'List Guru',
                menu: 'datakaryawan',
                layout: 'gaji-layout',
                listmenu,
                karyawan: dkaryawan.krows,
                jabatan: dkaryawan.jrows
            })
        })
    })
    next()
}

const postGuruKaryawan = async (req, res, next) =>{
    const id = req.body.inidkaryawan
    const nama = req.body.innamakaryawan
    const jabatan = req.body.injabatan
    outGaji.addGuruKaryawan(id,nama,jabatan,function(data) {
        // console.log(data.status);
        if (data.status == 'ok') {
            res.redirect("")
        } else {
            
        }
    })
    // console.log(id, nama, jabatan);

}

const getJabatan = async (req, res) =>{
    getmenu(function(listmenu) {
        outGaji.getJabatan(function(djabatan) {
            console.log(djabatan.jrows);
            res.render('./pages/gj-jabatan',{
                title: 'data jabatan',
                page: 'gj',
                dess: 'List Jabatan',
                menu: 'datajabatan',
                layout: 'gaji-layout',
                listmenu,
                djabatan: djabatan.jrows
            })
        })
    })
}

const getPenggajian = async (req, res) =>{
    const now = new Date();
    const tgl = date.format(now, 'YYYYMM')
    var get_year = tgl.substring(0,4)
    var get_month = tgl.substring(4,6)
    var filter = get_year+"-"+get_month
    // console.log(filter);
    getmenu(function(listmenu) {
        res.render('./pages/gj-penggajian',{
            title: 'data penggajian',
            page: 'gj',
            dess: 'List Penggajian',
            menu: 'datapenggajian',
            layout: 'gaji-layout',
            listmenu,
            filter
        })
    })
}

const getLaporan = async (req, res) =>{
    getmenu(function(listmenu) {
        res.render('./pages/gj-laporan',{
            title: 'data laporan',
            page: 'gj',
            dess: 'List Laporan',
            menu: 'datalaporan',
            layout: 'gaji-layout',
            listmenu
        })
    })
}
// end logic--------------------------------------------------------------

module.exports = {
    noMenu,
    getGuruKaryawan,
    getJabatan,
    getPenggajian,
    getLaporan,
    postGuruKaryawan,
    get,
    getAll,
    getTunggakan,
    outSearch,
    getSearch,
    addNew,
    getNewsubmit,
    edit,
    update,
    getDelete,
    cetakAll,
    cetakDetail
}