'use strict';
const path = require('path');
const dbPath = path.dirname(process.cwd());
const menu = require('../data/getMenu');
const appMenu = require('../data/addmenu');
const appKas = require('../data/kas');
const appSiswa = require('../data/siswa');
const propil = require('../data/profilkop')
const fs = require('fs');
const date = require('date-and-time');
// const open = require('open');

//read excel
// const readXlsxFile = require('read-excel-file/node')
var parser = require('simple-excel-to-json');
//GET
const getSetting = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                res.redirect('/settings/menu');
            }else{
                res.redirect('/logout');
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const getSetAkun = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                

                getmenu(function(listmenu) {
                    res.render('./pages/set-akun', {
                        title: 'Pengaturan Akun',
                        page: 'setting',
                        menu: 'akun',
                        layout: 'settings-layout',
                        listmenu
                    });
                });
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const getSetKas = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                return appKas.getSumberDana(function(data) {
                    const kas = data.kas.filter(item => item.id !== 'kas1' && item.id !== 'kas2');                    
                    if (data.status === "ok") {
                        getmenu(function(listmenu) {
                            res.render('./pages/set-kas', {
                                title: 'Pengaturan Kas',
                                page: 'setting',
                                menu: 'kas',
                                layout: 'settings-layout',
                                listmenu,
                                sd: data.sumberdana,
                                kas,
                                succ:req.flash('kopsuccess')
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

//tampilkan menu yang akan dilempar di /pages/set-menu
const getSetMenu = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                // getmenu memiliki parameter fungsi yang berasal dari parameter allmenu pada fungsi callback
                getmenu(function(listmenu) {
                    res.render('./pages/set-menu', {
                        title: 'Pengaturan Menu',
                        page: 'setting',
                        menu: 'menu',
                        layout: 'settings-layout',
                        // listmenu in dan out berdasarkan pada json dari fungsi getmenu bawah
                        inmenu: listmenu.in,
                        outmenu: listmenu.out,
                        listmenu            
                    });
                });
            }else{
                res.redirect('/logout');
            }
        });  
    } catch (error) {
        console.log(error);
    }       
}

const getSetBackup = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                getmenu(function(listmenu) {
                    res.render('./pages/set-backup', {
                        title: 'Backup & restore',
                        page: 'setting',
                        menu: 'backup',
                        layout: 'settings-layout',
                        listmenu,
                        backsucc: req.flash('backupsuccess')
                    })
                })
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const getSetProfile = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                getmenu(function(listmenu) {
                    res.render('./pages/set-profile', {
                        title: 'Profile & Kop Laporan',
                        page: 'setting',
                        menu: 'profile',
                        layout: 'settings-layout',
                        listmenu,
                        update: req.flash('updateok'),
                        tambah: req.flash('tambahok')
                    })
                })
            }else{
                res.redirect('/logout');
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const getEditKelas = async (req, res) => {
    try {
        var kd = req.query.kd;
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                return appSiswa.editKelas(kd, function(data) {
                    getmenu(function(listmenu) {
                        res.render('./pages/set-editkelas', {
                            title: 'Edit Kelas '+data.kelas.nama,
                            page: 'setting',
                            menu: 'siswa',
                            layout: 'settings-layout',
                            listmenu,
                            data,
                            kd,
                            err :req.flash('err'),
                            succ: req.flash('success')
                        });
                    });
                });
            }else{
                res.redirect('/logout');
            }            
        });
    } catch (error) {
        console.log(error);
    }    
}

const getSetSiswa = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                return appSiswa.getKelas(function(data) {
                        getmenu(function(listmenu) {
                            res.render('./pages/set-siswa', {
                                title: 'Pengaturan Data Siswa',
                                page: 'setting',
                                menu: 'siswa',
                                layout: 'settings-layout',
                                listmenu,
                                data
                            });
                        });
                });
            }else{
                res.redirect('/logout');
            }
        });        
    } catch (error) {
        console.log(error);
    }
}

//POST
const addNewKelas = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.body.kdKelas;
                var nama = req.body.namaKelas;
                // console.log(nama);
                return appSiswa.addKelas(kd,nama, function(data) {
                    if (data.status === 'ok') {
                        res.redirect('/settings/siswa');
                    }else if (data.status === 'no') {
                        res.redirect('/settings/siswa')
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

const postEditKelas = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.body.getKd;
                var nama = req.body.inputNama;
                var wali = req.body.inputWali;
                return appSiswa.updateKelas(kd,nama,wali, function(data) {
                    if (data.status === "ok") {
                        res.redirect("/settings/editkelas?kd="+kd);
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

const postDeleteKelas = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.query.kd;
                return appSiswa.deleteKelas(kd, function(data) {
                    if (data.status === 'ok') {
                        res.redirect("/settings/siswa");
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

const postProfile = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                const namasekolah = req.body.inpNamaSekolah
                const alamat = req.body.inpAlamat
                const notelp = req.body.inpNoTelp
                const kepsek = req.body.inpKepSek
                propil.postProfile(namasekolah, alamat, notelp, kepsek, function(data) {
                    console.log(data.status);
                    if (data.status === 'updateok') {
                        req.flash('updateok', 'profil sekolah berhasil diupdate')
                        res.redirect('/settings/profile')
                    } else {
                        req.flash('tambahok', 'profil sekolah berhasil ditambahkan')
                        res.redirect('/settings/profile')
                    }
                })
            } else {
                res.redirect('/logout');
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const addDataSiswa = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.query.kd;
                var nis = req.body.inputNis;
                var nama = req.body.inputNama;
                return appSiswa.addSiswa(kd,nis,nama, function(data) {
                    if (data.status === "ok") {
                        res.redirect("/settings/editkelas?kd="+kd);
                    }else{
                        res.redirect("/settings/editkelas?kd="+kd);
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

const delAllSiswa = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.query.kd;
                return appSiswa.delAll(kd, function(data) {
                    if (data.status === "ok") {
                        res.redirect("/settings/editkelas?kd="+kd);
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

const delSelectedSiswa = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var nis = req.query.nis;
                var kelas = req.query.kelas;
                return appSiswa.delSelected(nis,kelas, function(data) {
                    if (data.status === "ok") {
                        res.redirect("/settings/editkelas?kd="+kelas);
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

const editSelectedSiswa = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.query.kd;
                var nis = req.query.nis;
                var nama = req.body.editNama;
                return appSiswa.editSiswa(kd,nis,nama, function(data) {
                    if (data.status === "ok") {
                        res.redirect("/settings/editkelas?kd="+kd)
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
//create menu sidebar
const addNewMenu = async (req, res, next) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
              //from id or name form
                //request dari url action from method dimulai setelah tanda tanya
                // menu -> kolom kd
                var menu = req.query.menu;
                //no -> kolom sub
                var no = req.body.menuNomor;
                //nama  -> kolom nama
                var nama = req.body.menuNama;
                //
                var dess = req.body.menuDes;
                //buat variabel kosong
                var dbs = "";
                //buat kondisi jika id menu = 1 gunakan dbsiswa in jika 2 gunakan dbsiswaout
                if (menu === "1") {
                    dbs = req.body.dbSiswaIn;
                }else if (menu === "2") {
                    dbs = req.body.dbSiswaOut;
                }
                // from data/addmenu.js
                return appMenu.addNew(no,nama,dess,menu,dbs, function(data) {
                    if (data.status === 'ok') {
                        res.redirect('/settings/menu');
                    }else if (data.status === 'no') {
                        res.redirect('/settings/menu');
                    }
                });
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
    next()
}

const delMenu = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.query.kd;
                var id = req.query.id;
                return appMenu.deleteMenu(kd,id, function(data) {
                    if (data.status === 'ok') {
                        res.redirect('/settings/menu');
                    }else if (data.status === 'no') {
                        res.redirect('/settings/menu');
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

//appmenu from data/addmenu
const editMenu = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.query.kd;
                var id = req.query.id;
                var nama = req.body.editNama;
                var dess = req.body.editDess;
                let dbs = '';

                if (kd === "1") {
                    dbs = req.body['dbSiswaEditIn'+id]
                }else if (kd === "2") {
                    dbs = req.body['dbSiswaEditOut'+id]
                }

                return appMenu.getEdit(kd,id,nama,dess,dbs, function(data) {
                    if (data.status === 'ok') {
                        res.redirect('/settings/menu');
                    }else if (data.status === 'no') {
                        res.redirect('/settings/menu');
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

const addNewDana = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                const sd = req.body.SumberDana;
                return appKas.addSumberDana(sd, function(data) {
                    if (data.status === "ok") {
                        res.redirect('/settings/kas');
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

const delDana = async (req,res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var id = req.query.id;
                var nama = req.query.nama;
                if (id, nama) {
                    return appKas.delSumberDana(id,nama, function(data) {
                        if (data.status === "ok") {
                            res.redirect('/settings/kas');
                        }
                    });
                }
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

//list siswa
const getListSiswa = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kelas = req.params.kelas;
                //panggil fungsi dari data/siswa.js yang mengandung parameter callback
                return appSiswa.getSiswa(kelas, function(data) {
                  //lempar kemana ?  
                  res.send({
                        status:'ok',
                        data
                    })
                });
            }else{
                res.redirect('/logout');
            }
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

//MENU -> data/getmenu.js (function yang akan di render di setiap halaman)
async function getmenu(callback) {
    try {
        //getMenu merupakan function dari data/getmenu.js yang dimana diisikan parameter bernama data yang difilter berdasarkan kd
        await menu.getMenu(function(data) {
          //filter item yang dimana datanya sudah di inisialisasi di data/getMenu(callback)
            const inmenu = data.filter(item => item.kd === 1);
            const outmenu = data.filter(item => item.kd === 2);
            
            //buat json yang ditampung di variable allmenu yang akan di resolve
            const allmenu = {
                in: inmenu,
                out: outmenu
            }
            //buat fungsi callback yang akan di render setiap halaman
            callback(allmenu);
        });
    } catch (error) {
        console.log();
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
  const cek = cekLogin(req.session.loggedIn);
  await Promise.resolve(cek).then(result =>{
      if (result == true) { 
          var id = req.query.id;
          //data/kas.js
          return appKas.delKas(id,function(data) {
              if (data.status === 'ok') {
                  res.redirect('/settings/kas');
              }else if (data.status === 'no') {
                  res.redirect('/settings/kas');
              }
          });
      }else{
          res.redirect('/logout');
      }
  });
}

const postEditKas = async (req, res) => {
const cek = cekLogin(req.session.loggedIn);
await Promise.resolve(cek).then(result =>{
    if (result == true) { 
      var id = req.query.id;
      var nama = req.body.editNama;
      return appKas.editKas(id, nama, function (data) {
        if (data.status == "ok") {
          res.redirect("/settings/kas")
        }else if (data.status === 'no') {
          res.redirect('/settings/kas');
        }
      })
    }else{
        res.redirect('/logout');
    }
});
}

// upload
const uploadTemplate = async function(req, res, next){
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                var kd = req.query.kd;
                // readXlsxFile('uploads/TemplateSiswa.xlsx').then((rows) => {
                const doc = parser.parseXls2Json('uploads/formFileTemplate.xlsx')
                // console.log(doc[0]);
                const data_template = [];
                for (let i = 0; i < doc[0].length; i++) {
                    data_template.push(doc[0][i])
                }
                // console.log(data_template);
                return appSiswa.addTemplate(data_template,kd, function(data) {
                    //  console.log(kd);
                    //  console.log(data);
                    if (data.status === "ok") {
                        req.flash('success', data.msg)
                      res.redirect("/settings/editkelas?kd="+kd);
                    }else{
                        req.flash('err', data.msg)
                      res.redirect("/settings/editkelas?kd="+kd);
                  }
                  })
            } else {
                res.redirect('/logout');
            }
        })
    } catch (error) {
        console.log(error);
    }

}

const uploadKop = async function(req,res, next) {
    req.flash('kopsuccess', `kop berhasil di unggah`)
    res.redirect('/settings/kas')
}

const uploadlogo = async function(req,res,next) {
    console.log('succ');
    res.redirect(`/settings/profile`)
    next()
}

//backup
const backup = async function(req, res, next) {
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
    const dbold = path.resolve(dbPath, './SAKUMU-V1.1/db/database.db');
    // const dbackup = fs.createWriteStream(`./backup/${tgl}/database.db`);
    fs.copyFile(dbold, `./backup/database${tgl}.db`, function (err) {
        if (err) throw err
        req.flash('backupsuccess', `backup data pada file /SAKUMU-V1/backup/database${tgl}.db telah berhasil | lakukan backup secara berkala`);
        res.redirect('/settings/backup');
      })
}

const restoreDB = async function(req,res, next) {
    req.flash('restoresuccess', `restore database success`)
    res.redirect('/settings/backup')
    next();
}

// const printkwitansi = async (req, res) =>{
//     const data = req.query.file;
//     const buka = open(path.resolve(__dirname, `../../laporan/kwitansi/penerimaan/${data}`))
//     // const file = fs.readFileSync(path.resolve(__dirname, `../../laporan/kwitansi/penerimaan/${data}`))
//     res.redirect('./penerimaan/')
// }
const getSetMenuAPI = async (req, res) => {
    try {
        await menu.getMenu(function(data) {
            const inmenu = data.filter(item => item.kd === 1)
            const outmenu = data.filter(item => item.kd === 2)

            res.send({status:200, msg:'ok', inmenu:inmenu, outmenu:outmenu})
        })
    } catch (error) {
        res.send({status:500, msg:'error'}) 
    }
}

const getSetKasApi = async (req, res) =>{
    try {
        await appKas.getSumberDana(function(data) {

            if (data.status === 'ok') {
                res.send({status:200, msg:'ok', sd: data.sumberdana, kas: data.kas})
            }
        })
    } catch (error) {
        res.send({status:500, msg:'error'})
    }
}

const getSetKelasApi = async (req, res) =>{
    try {
        await appSiswa.getKelas(function(data) {
                res.send({status:200, msg:'ok', kelas: data})
        })
    } catch (error) {
        res.send({status:500, msg:'error'})
    }
}



module.exports = {
    getSetting,
    getSetAkun,
    getSetKas,
    getSetMenu,
    getSetBackup,
    getSetSiswa,
    getSetProfile,
    postAddKas,
    postDelKas,
    postEditKas,
    addNewKelas,
    getEditKelas,
    postEditKelas,
    postDeleteKelas,
    addDataSiswa,
    delAllSiswa,
    delSelectedSiswa,
    editSelectedSiswa,
    addNewMenu,
    delMenu,
    editMenu,
    addNewDana,
    delDana,
    getListSiswa,
    uploadTemplate,
    uploadKop,
    backup,
    restoreDB,
    uploadlogo,
    postProfile,
    getSetMenuAPI,
    getSetKasApi,
    getSetKelasApi
    // printkwitansi
}
