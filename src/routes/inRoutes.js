'use strict';

const express = require('express');
const router = express.Router();
const inController = require('../controllers/inController');

//GET
//blank page penerimaan -> incontroller.js -> noMenu
router.get("/", inController.noMenu);
//penerimaan title=id -> incontroller.js(get) 
router.get("/:no", inController.get);
router.get("/:no/edit", inController.edit);
//tambah penerimaan -> inController.js(addNew) -> inNew.js(addData)
router.get("/:no/add", inController.addNew);
//get semua data
router.get("/:no/all", inController.getAll);
router.get("/:no/cetakall", inController.cetakAll);
router.get("/:no/cetakdetail", inController.cetakDetail);
//get tunggakan -. inController.js(getTunggakan) -> inData(tunggakan)
router.get("/:no/tunggakan", inController.getTunggakan);
router.get("/:no/search", inController.getSearch);
router.get("/:no/delete", inController.getDelete);

//POST
router.post("/:no/edit", inController.update);
router.post("/:no", inController.inSearch);
router.post("/:no/newsubmit", inController.newSubmit);
router.get("/:no/printkwitansi", inController.printkwitansi)

module.exports = {
    inroutes: router
}