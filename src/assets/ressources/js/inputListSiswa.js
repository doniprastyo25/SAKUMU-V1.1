'use strict';
const Http = new XMLHttpRequest();
var formKelas = document.getElementById('inpKelas');
var dataListSiswa = document.getElementById('listSiswa');
var formSiswa = document.getElementById('inpUraian');

if (formKelas.value.length > 0) {
    getSiswa(formKelas.value)
}else{
    formSiswa.disabled = true;
}

formKelas.addEventListener('change', function(e) {
    getSiswa(this.value)
})

async function getSiswa(kelas) {
    formSiswa.disabled = true;

    const url = '/siswa/'+kelas;
    console.log(url);
    const response = await fetch(url, {
        method: 'GET'
    });
    const data = await response.json(Object);
    console.log(data);
    let options = '';
    if (data.status === 'ok') {
        var array = data.data;        
        if (array.length !== 0) {
            formSiswa.disabled = false;
            
            for (let i = 0; i < array.length; i++) {
                options += '<option value="' + array[i].nis +","+array[i].nama +",Kelas "+array[i].kelas +  '" />';
            }
        }
    }
    dataListSiswa.innerHTML = options;
}
