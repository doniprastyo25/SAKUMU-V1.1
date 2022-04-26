'use strict';
const db = require('./database').db

//fungsi yang akan di lempar ke controller dimana parameter callback merupakan fungsi yang memiliki parameter data
async function getMenu(callback) {
    //buat query select dari submenu yang akan ditampung ke dalam variable query
    let query = "SELECT *FROM SUBMENU ORDER BY kd, sub";
    try {
        //inisialisasi better-sqlite3
        const rows = db.prepare(query).all();
        //buat fungsi callback(rows) yang akan dilanjutkan di appController/getMenu(function(data))
        callback(rows);
        //alternatif gabung
        //   function(rows) {
        //     const inmenu = rows.filter(item => item.kd === 1);
        //     const outmenu = rows.filter(item => item.kd === 2);
            
        //     const allmenu = {
        //         in: inmenu,
        //         out: outmenu
        //     }
        // }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getMenu
}