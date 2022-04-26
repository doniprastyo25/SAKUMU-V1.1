'use strict'
const path = require('path');
const dbPath = path.dirname(process.cwd());
// const dbPath = path.dirname('./');
console.log(dbPath);
const filedb = path.resolve(dbPath, './SAKUMU-V1.1/db/database.db');
const sqlite = require('better-sqlite3');
const db = new sqlite(filedb);

module.exports={db}