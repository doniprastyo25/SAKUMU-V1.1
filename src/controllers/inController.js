'use strict';
const fs = require("fs");
const PDFDocument = require("pdfkit-table");
const PDFkitDoc = require('pdfkit')
const inData = require('../data/inData.js');
const inNew = require('../data/inNew.js');
const rupiah = require('rupiah-format');
const replaceAll = require('replaceall');
const menu = require('../data/getMenu');
const date = require('date-and-time')
const path = require('path');
const open = require('open')


//function blank page -> /pages/in-menu-null.ejs => '/'
const noMenu = async (req,res) => {

    getmenu(function(listmenu) {
        res.render('./pages/in-menu-null',{
            title: 'Penerimaan',
            page: 'penerimaan',
            menu: 'penerimaan',
            layout: 'main-layout',
            listmenu    
        });
    });

}

//function get data siswa from inData.js(getData) -> /pages/penerimaan
const get = async (req,res) => {
    const folderPath = './laporan/kwitansi/penerimaan'
    const no = req.params.no;
    const getdate = req.query.date;
    console.log(getdate);
    await inData.getData(no,getdate,function(data) {
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
                colors:data.rows[i].color,
                nama :data.rows[i].nama,
                indikatorkelas : data.rows[i].warna                 
            });
        }
        inData.getBank(function (kdata) {
          let listkas = [];
            for (let i = 0; i < kdata.qrows.length; i++) {
              listkas.push({
                idkas: kdata.qrows[i].id,
                nkas: kdata.qrows[i].nama,
                ckas: kdata.qrows[i].color
              });        
            }
            const file = fs.readdirSync(folderPath)
            // console.log(file);
            getmenu(function(listmenu) {
                const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
                const dbs = getsub[0].dbsiswa;
                res.render('./pages/penerimaan',{
                    title: getsub[0].nama,
                    dess: getsub[0].dess,
                    page: '1'+no,
                    menu: 'penerimaan',
                    layout: 'main-layout',
                    sub: no,
                    data: listdata,
                    dkas: listkas,
                    listmenu,
                    dbs,
                    currentdate: data.filter,
                    msg: req.flash('msg'),
                    succ: req.flash('kwitansisuccess'),
                    err: req.flash('kwitansierror'),
                    laporansucc: req.flash('cetakallsuccess'),
                    file
                });
            })
        })
    });
}
//get semua data penerimaan
const getAll = async (req, res) => {
    const folderPath = './laporan/kwitansi/penerimaan'
    const no = req.params.no;
    await inData.getAllData(no,function(data) {
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
                colors:data.rows[i].color,                
                nama :data.rows[i].nama,
                indikatorkelas :data.rows[i].warna                
            });
        }
        inData.getBank(function (kdata) {
          let listkas = [];
            for (let i = 0; i < kdata.qrows.length; i++) {
              listkas.push({
                idkas: kdata.qrows[i].id,
                nkas: kdata.qrows[i].nama,
                ckas: kdata.qrows[i].color
              });        
            }
            // console.log(listkas);
            const file = fs.readdirSync(folderPath);
            getmenu(function(listmenu) {
              const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
              const dbs = getsub[0].dbsiswa;
              res.render('./pages/penerimaan',{
                  title: getsub[0].nama,
                  dess: getsub[0].dess,
                  page: '1'+no,
                  menu: 'penerimaan',
                  layout: 'main-layout',
                  sub: no,
                  data: listdata,
                  dkas: listkas,
                  listmenu,
                  dbs,
                  currentdate: data.filter,
                  msg: req.flash('msg'),
                  succ: req.flash('kwitansisuccess'),
                  err: req.flash('kwitansierror'),
                  laporansucc: req.flash('cetakallsuccess'),
                  file
              });
          });
        })
    });
}

// const getBank = async (req, res) => {
//   await inData.getBank(function (kdata) {
//     let listkas = [];
//       for (let i = 0; i < kdata.length; i++) {
//         listkas.push({
//           idkas: kdata.qrows[i].id,
//           nkas: kdata.qrows[i].nama,
//           ckas: kdata.qrows[i].color
//         });        
//       }
//   })
// }
//get tunggakan from inData(tunggakan) -> /pages/tunggakan-siswa
const getTunggakan = async (req, res) => {
    try {
        const no = req.params.no;
        const month = req.query.filter;
        await inData.tunggakan(no,month,function(data) {
            if (data.status === "ok") {
                getmenu(function(listmenu) {
                    const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
                    // console.log(getsub);
                    const jmenu = getsub[0].kd
                    // console.log();
                    const dbs = getsub[0].dbsiswa;
                    res.render('./pages/tunggakan-siswa',{
                        title: getsub[0].dess,
                        subtitle: 'Daftar siswa yang belum bayar',
                        page: '1'+no,
                        menu: 'penerimaan',
                        layout: 'main-layout',
                        sub: no,
                        dbs,
                        jmenu,
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

const inSearch = async (req,res) => {
    const no = req.params.no;
    const keyword = req.body.search;
    if (keyword) {
        res.redirect("/penerimaan/"+no+"/search?keyword="+keyword);
    }else{
        res.redirect("/penerimaan/"+no);
    }
}

const getSearch = async (req,res) => {
    const folderPath = './laporan/kwitansi/penerimaan'
    const no = req.params.no;
    const keyword = req.query.keyword;
    await inData.searchFilter(no,keyword, function(data) {
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

        inData.getBank(function (kdata) {
            let listkas = [];
              for (let i = 0; i < kdata.qrows.length; i++) {
                listkas.push({
                  idkas: kdata.qrows[i].id,
                  nkas: kdata.qrows[i].nama,
                  ckas: kdata.qrows[i].color
                });        
              }
              const file = fs.readdirSync(folderPath);
              getmenu(function(listmenu) {
                  const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
                  const dbs = getsub[0].dbsiswa;
                  res.render('./pages/penerimaan',{
                      title: getsub[0].nama,
                      dess: getsub[0].dess,
                      page: '1'+no,
                      menu: 'penerimaan',
                      layout: 'main-layout',
                      sub: no,
                      data: listdata,
                      dkas: listkas,
                      listmenu,
                      dbs,
                      currentdate: data.filter,
                      filter: '',
                      msg: req.flash('msg'),
                      succ: req.flash('kwitansisuccess'),
                      err: req.flash('kwitansierror'),
                      laporansucc: req.flash('cetakallsuccess'),
                      file
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
    doc.pipe(fs.createWriteStream(`./laporan/penerimaan/penerimaan ${tgl}.pdf`));
    await inData.buildPDFAll(no, starttgl, endtgl, function(data) {
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
                satuan:rupiah.convert(data.rows[i].satuan),
                jumlah:data.rows[i].jumlah,
                total:rupiah.convert(data.rows[i].total),
            })
        }
        const table = {
            title: "Laporan Keuangan",
            subtitle: `laporan penerimaan`,
            padding: 100,
        headers: [
          { label:"nomor", property: 'no', width: 30, renderer: null },
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
          if (data.status =='ok') {
              req.flash('cetakallsuccess', `laporan penerimaan berhasil dicetak dengan nama file | penerimaan ${tgl}.pdf |`)
              res.redirect(`/penerimaan/${no}`)
          } else {
                res.redirect(`/penerimaan/${no}`)
          }
    })
      next();
}

const cetakDetail = async (req, res, next) => {
    const no = req.params.no
    const id = req.query.id
    const name = req.query.uraian
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
    doc.pipe(fs.createWriteStream(`./laporan/kwitansi/penerimaan/${name} ${tgl}.pdf`));
    await inData.cetakKwitansi(no, id, function (data) {
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
        const table5 = {
            padding: 100,
            headers: [
                {label:"Sumber Dana", property:'sumber', width:200, headerColor:'white', renderer:null},
                {label:`${data.field.sumber}`, width:320, headerColor:`white`, renderer:null}
            ]
        }
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
        doc.table(table5, {
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
            req.flash('kwitansisuccess', `kwitansi ${data.field.dess} ${data.field.uraian} telah tercetak dengan nama file | kwitansi ${tgl}.pdf |pada folder SAKUMU-BETA-APP/kwitansi/penerimaan/`);
            res.redirect(`/penerimaan/${no}`)
        }else{
            req.flash('kwitansierror', data.msg);
        }
    })
    open(path.resolve(__dirname, `../../laporan/kwitansi/penerimaan/${name} ${tgl}.pdf`))
    next();
}

//get function from inNew.js(addData) -> /pages/in-tambah
const addNew = async (req,res) => {
    let tanggal = ""
    const no = req.params.no;
    const tgl = new Date();
    tanggal = date.format(tgl, 'YYYYMMDD');
    const getTahun = tanggal.substring(0,4)
    const getBulan = tanggal.substring(4,6)
    const getHari = tanggal.substring(6,8)
    const nowdate = getTahun+"-"+getBulan+"-"+getHari
    await inNew.addData(function(data) {
        if (data.status === "ok") {
            getmenu(function(listmenu) {
                const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
                const dbs = getsub[0].dbsiswa;
                if (dbs == 0) {
                    res.render('./pages/in-tambah',{
                        title : 'Input Baru',
                        subtitle: getsub[0].nama,
                        page: '1'+no,
                        menu: 'penerimaan',
                        layout: 'main-layout',
                        sub: no,
                        kas:data.kas,
                        listmenu,
                        sd:data.sd,
                        nowdate: nowdate                        
                    });                        
                }else if (dbs == 1) {
                    res.render('./pages/in-tambah-dbs',{
                        title: 'Input Baru',
                        subtitle: getsub[0].nama,
                        page: '1'+no,
                        menu: 'penerimaan',
                        layout: 'main-layout',
                        sub: no,
                        listmenu,
                        kas:data.kas,
                        sd:data.sd,
                        kelas:data.kls,
                        err: req.flash('err'),
                        nowdate: nowdate 
                    })
                }
            });
        }
    })
}

const newSubmit = async (req,res) => {
    const no = req.params.no
    const uraian = req.body.inpUraian;
    const satuanrp = req.body.inpSatuan;
    const satuan = replaceAll(".","", satuanrp);
    const jumlah = req.body.inpJumlah;
    const dana = req.body.inpSDana;
    const kas = req.body.inpKas;
    const tgl = req.body.date;
    const now = new Date();
    const jam = date.format(now, 'HHmmss')
    const sortirtgl = replaceAll("-","", tgl)
    const tglfix = sortirtgl+jam
    console.log(tglfix);
    if (typeof uraian !== "undefined") {
        const result = await inNew.submitNew(no,tglfix,uraian,satuan,jumlah,dana,kas, function(data) {
            if(data['status'] === 'ok'){
                var total = parseInt(satuan)*parseInt(jumlah);
                req.flash('msg','Data '+uraian+' sebesar '+rupiah.convert(total)+' berhasil ditambahkan!')
                res.redirect(301,'/penerimaan/'+no);
            }
        });
        return result;
    }else{
        req.flash('err','Pastikan kelas dan nama siswa tidak kosong!');
        res.redirect('/penerimaan/'+no+'/add')
    }
}

const edit = async (req,res) => {
    const no = req.params.no
    const id = req.query.id
    const result = await inData.getEdit(no,id,function(data) {
        // console.log(data.field.timestamp);
        const tgl = data.field.timestamp
        const btgl = tgl.toString()
        const getTahun = btgl.substring(0,4)
        const getBulan = btgl.substring(4,6)
        const getHari = btgl.substring(6,8)
        const tanggalan = getTahun+"-"+getBulan+"-"+getHari
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
                  const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
                  res.render('./pages/in-edit',{
                      title : 'Edit',
                      subtitle: getsub[0].dess,
                      page: '1'+no,
                      menu: 'penerimaan',
                      layout: 'main-layout',
                      sub: no,
                      data: data.field,
                      dkas: listkas,
                      listmenu,
                      sd:data.sd,
                      tanggalan
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
    const tgl = req.body.date;
    const now = new Date();
    const jam = date.format(now, 'HHmmss');
    const sortirtgl = replaceAll("-","",tgl);
    const tglfix = sortirtgl+jam
    const result = await inNew.updateData(no,id,tglfix,uraian,satuan,jumlah,dana,kas, function(data) {
        if(data['status'] === 'ok'){
            res.redirect(301,'/penerimaan/'+no);
        }
    });
    return result;
}

const getDelete = async (req,res) => {
    const no = req.params.no;
    const id = req.query.id;
    const result = await inNew.deleteData(no,id, function(data) {
        if(data['status'] === 'ok'){
            res.redirect(301,'/penerimaan/'+no);
        }
    });
    return result;
}

const printkwitansi = async (req, res) =>{
    const data = req.query.file;
    console.log(data);
    const id = req.params.no;
    const buka = open(path.resolve(__dirname, `../../laporan/kwitansi/penerimaan/${data}`))
    // const file = fs.readFileSync(path.resolve(__dirname, `../../laporan/kwitansi/penerimaan/${data}`))
    res.redirect(`./`)
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

module.exports = {
    noMenu,
    get,
    getAll,
    getTunggakan,
    inSearch,
    getSearch,
    newSubmit,
    addNew,
    edit,
    update,
    getDelete,
    cekLogin,
    cetakAll,
    cetakDetail,
    printkwitansi
    // getBank
}