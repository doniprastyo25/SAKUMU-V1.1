'use strict';

const express = require('express');
const router = express.Router();
const outController = require('../controllers/outController');

//GET
//blank page pengeluaran -> outController.js -> noMenu
router.get("/", outController.noMenu);
//pengeluaran title=id -> outController.js -> get
router.get("/:no", outController.get);
router.get("/:no/edit", outController.edit);
router.get("/:no/add", outController.addNew);
router.get("/:no/all", outController.getAll);
router.get("/:no/cetakall", outController.cetakAll);
router.get("/:no/cetakout", outController.cetakDetail);
router.get("/:no/tunggakan", outController.getTunggakan);
router.get("/:no/search", outController.getSearch);
router.get("/:no/delete", outController.getDelete);

//POST
router.post("/:no/edit", outController.update);
router.post("/:no", outController.outSearch);
router.post("/:no/newsubmit", outController.getNewsubmit);
module.exports = {
    outroutes: router
}