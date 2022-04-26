'use strict';
const express = require('express');
const axios = require('axios');
const helmet = require('helmet');
const open = require('open');
const compression = require('compression');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const isOnline = require('is-online');
const db = require('./src/data/database').db
// const multer = require('multer');

const appRoutes = require('./src/routes/appRoutes');
const inRoutes = require('./src/routes/inRoutes');
const outRoutes = require('./src/routes/outRoutes');

const app = express();
app.use(helmet());
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

//flash config
app.use(cookieParser('secretMMSPObyrikiyukie2022'));
app.use(
    session({
        cookie: {expires: 6000},
        secret: 'secretMMSPObyrikiyukie2022',
        resave: false,
        saveUninitialized: false
    })
);
app.use(flash());

//layouts
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));

//route
app.use("/", appRoutes.routes);
//routes
app.use("/penerimaan", inRoutes.inroutes);
app.use("/pengeluaran", outRoutes.outroutes);

//static
app.use("/gambar", express.static(path.join(__dirname + "/img/logo")));
app.use("/docs", express.static(path.join(__dirname, 'docs')));
app.use("/styles", express.static(path.join(__dirname + "/src/assets/bootstrap")));
app.use("/fonts", express.static(path.join(__dirname + "/src/assets/fonts")));
app.use("/icon", express.static(path.join(__dirname + "/src/assets/bootstrap-icons")));
app.use("/ressources", express.static(path.join(__dirname + "/src/assets/ressources")));
app.use("/filepath", express.static(path.join(__dirname + "/upload")));
app.use("node", express.static(path.join(__dirname + "/node_modules/read-excel-file/node")));

//server
app.listen(8000, ()=>{
    console.log("");
    console.log(" =====================================");
    console.log("                (SAKUMU)              ");
    console.log(" Sistem Aplikasi Keuangan Muhammadiyah");
    console.log(" =====================================");
    console.log("");
    console.log(" Powered by :");
    console.log(" PT BPRS Mitra Mentari Sejahtera");
    console.log("");
    console.log(" url : http://localhost:8000");
    console.log("");
    console.log(" app version 1.0");
    console.log(" _________________________________");
    console.log("");
    
    // openlink();

});


// -------------------------------service cek koneksi-----------------------------------------//
setInterval(() => {
    (async () => {
        // console.log(await isOnline());
        if (await isOnline() == true) {
            console.log('sedang online');
            gettoken(function(data) {
                // console.log(data.status);
                if (data.status == true) {
                    // console.log(data.token);
                    try {
                        axios({
                            method: 'get',
                            // url: 'http://localhost:3123/API/cektoken',
                            url: 'http://467a0269edbd.sn.mynetname.net:80/API/cektoken',
                            // url: 'http://192.168.151.31:3123/API/cektoken',
                            data: {token: data.token},
                            timeout: 10000
                        }).then(function(response) {
                            const res = response.data;
                            if (res.data.status == 'ok') {
                                console.log('token sesuai');
                            } else {
                                console.log('token tidak sesuai');
                                try {
                                    db.prepare(`DELETE FROM APPCONFIG`).run();
                                } catch (error) {
                                    console.log('request time ouut');
                                }
                            }
                        }).catch(function (error) {
                            if (error.code == 'ECONNREFUSED') {
                                console.log('server sedang offline');
                            }
                        })
                    } catch (error) {
                        // console.log(error);
                        console.log('request  time out');
                    }
                } else {
                    console.log('error');
                }
            })
        } else {
            console.log('sedang offline');
        }
    })();
  }, 100000);

  const gettoken = async (callback) => {
    try {
        const get = `SELECT * FROM APPCONFIG`;
        const tok = db.prepare(get).get();
        if (tok) {
            const token = tok.token
            callback({status:true , token: token})
            // console.log(token);
        } else {
            // callback({status:false , token: error})
            console.log('token belum ada');
        }
    } catch (error) {
        console.log(error);
    }
}
//----------------------------------- end service cek koneksi --------------------------------------//


async function openlink() {
    await open('http://localhost:8000', {app: {name: 'chrome'}});
}
module.exports = {
    app,
    openlink
};