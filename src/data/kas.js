'use strict';
const db = require('./database').db

const getSaldoKas = async function(callback) {
    let query = "SELECT * FROM KAS";
    let getkas = [];

    try {
        const rows = db.prepare(query).all();
        for (let i = 0; i < rows.length; i++) {
            const idkas = rows[i].id;
            getkas.push("(SELECT SUM(total) as in"+idkas+" FROM PENERIMAAN WHERE kas='"+idkas+"'),(SELECT SUM(total) as out"+idkas+" FROM PENGELUARAN WHERE kas='"+idkas+"')")
        }

        const getinkas = "SELECT * FROM "+getkas.toString();
        try {
            const inkas = db.prepare(getinkas).get();
            const datajs = JSON.stringify(inkas, function(key, value) {
                return (value === null) ? 0 : value;
            });

            const finaldata = {
                kas:rows,
                inout:JSON.parse(datajs)
            }
            //console.log(finaldata);
            callback(finaldata);
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
}

const getSumberDana = async function(callback) {
    await getKas(function(data) {
        const query = "SELECT *FROM SUMBERDANA order by id";
        try {
            const rows = db.prepare(query).all();
            callback({status:"ok",kas: data,sumberdana:rows});
        } catch (error) {
            console.log(error);
        }
    });
}

const addSumberDana = async function(sd,callback) {
    let nomor = 1;
    let getno = "SELECT max(id) as no FROM SUMBERDANA";
    try {
        const nomax = db.prepare(getno).get();
        if (nomax.no != null) {
            nomor = nomax.no + 1
        }
        let insert = "INSERT INTO SUMBERDANA (id,nama) VALUES ("+nomor+",'"+sd+"')";
        try {
            const pre = db.prepare(insert);
            const run = pre.run();
            if (run.changes > 0) {
                callback({status: "ok", msg: "sukses"});
            }
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
}

const delSumberDana = async function(id,nama,callback) {
    const query = "DELETE FROM SUMBERDANA WHERE id="+id+" AND nama='"+nama+"'";
    try {
        const run = db.prepare(query).run();
        if (run.changes > 0) {
            callback({status: "ok",msg: "- Sumber dana "+nama+" berhasil dihapus."});
        }
    } catch (error) {
        console.log(error);
    }
}

const getKas = async function(callback) {
    const query = "SELECT *FROM KAS"
    try {
        const exe = db.prepare(query).all();
        return callback(exe);
    } catch (error) {
        console.log();
    }
}

const addKas = async function(nama_kas,color, callback) {
    await getKas(function(data) {
        const id = data.length+1
        const query = "INSERT INTO KAS (id,nama,color) VALUES ('kas"+id+"','"+nama_kas+"','"+color+"')";
        try {
            const exe = db.prepare(query).run();
            if (exe.changes > 0) {
                return callback({status: "ok", msg: "kas berhasil ditambahkan"});
            }
        } catch (error) {
            console.log();
        }
    });
}

const delKas = async function (id,callback) {
  const kd1 = "PENERIMAAN";
  const kd2 = "PENGELUARAN";
  let que1 = `DELETE FROM KAS WHERE id=@id`;
  // hapus semua data penerimaan dan pengeluaran berdasarkan kas
  let que2 = `DELETE FROM ${kd1} WHERE kas=@id AND EXISTS(SELECT *FROM ${kd1} WHERE Kas=@id LIMIT 1)`;
  let que3 = `DELETE FROM ${kd2} WHERE kas=@id AND EXISTS(SELECT *FROM ${kd2} WHERE Kas=@id LIMIT 1)`;

  try {
      const statement = [que1,que2, que3].map(sql => db.prepare(sql));
      const transaction = db.transaction((data)=>{
          for(const stmt of statement){
            stmt.run(data);        
          }
      });
      transaction({id:id});
      // console.log(transaction);

      callback({status:'ok', msg:'sukses'});
      console.log('- Menu berhasil dihapus');
  } catch (error) {
      console.log(error);
  }
}

const editKas = async function (id, nama, callback) {
  let update = `UPDATE KAS SET nama= '${nama}' WHERE id= '${id}'`
  console.log(update);
  try {
    const pre = db.prepare(update).run();
    if (pre.changes > 0) {
      return callback({status:"ok", msg:"sukses"})
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
    getSaldoKas,
    getSumberDana,
    addSumberDana,
    delSumberDana,
    addKas,
    editKas,
    delKas,
}