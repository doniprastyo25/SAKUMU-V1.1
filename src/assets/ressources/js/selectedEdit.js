'use strict';
var getSumber = document.getElementById('getSumber');
var sumber = document.getElementById('inpSDana');

if (getSumber) {
    if (getSumber.value !== sumber.value) {
        sumber.value = getSumber.value;
    }
}

var getKas = document.getElementById('getKas');
var kas = document.getElementById('inpKas');

if (getKas) {
    if (getKas.value !== kas.value) {
        kas.value = getKas.value;
    }
}
