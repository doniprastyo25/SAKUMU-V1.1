// variable logic potongan
var formpotongan = document.getElementById('formpotongan')
var add_more_fields = document.getElementById('add_more_fields');
var remove_fields = document.getElementById('remove_fields');

// variable logic tunjangan
var formtunjangan = document.getElementById('formtunjangan')
var add_more_fields1 = document.getElementById('add_more_fields1')
var remove_fields1 = document.getElementById('remove_fields1')

// logic add form potongan
add_more_fields.onclick = function(){
    var newnpotongan = document.createElement('input');
    newnpotongan.setAttribute('type','text');
    newnpotongan.setAttribute('class','form-control form-control-sm');
    newnpotongan.setAttribute('placeholder','tambahakan potongan');
    newnpotongan.setAttribute('name','ntpotongan');
    newnpotongan.setAttribute('id','ntpotongan');
    newnpotongan.setAttribute('autocomplete','off');
    var newjpotongan = document.createElement('input');
    newjpotongan.setAttribute('type','text');
    newjpotongan.setAttribute('class','form-control form-control-sm');
    newjpotongan.setAttribute('placeholder','Rp');
    newjpotongan.setAttribute('name','jtpotongan');
    newjpotongan.setAttribute('id','jtpotongan');
    newjpotongan.setAttribute('value','')
    newjpotongan.setAttribute('autocomplete','off');
    var bungkus = document.createElement("div")
    bungkus.setAttribute('class', 'col-sm-6 mt-3')
    var bungkus1 = document.createElement("div")
    bungkus1.setAttribute('class', 'col-sm-6 mt-3')
    bungkus.appendChild(newnpotongan)
    bungkus1.appendChild(newjpotongan)
    formpotongan.appendChild(bungkus);
    formpotongan.appendChild(bungkus1);
    // logic rupiah
    const potong = formpotongan.getElementsByTagName('input');
    for (let i = 0; i < potong.length; i++) {
      if ([i]%2!=0) {
        if (potong[i].value.length > 0) {
          potong[i].value = (formatRupiah(potong[i].value));
        }
        potong[i].addEventListener('keyup', function(e) {
          potong[i].value = formatRupiah(this.value);
        });
      }
    }
  }

  // logic remove form
  remove_fields.onclick = function(){
    var input_tags = formpotongan.getElementsByTagName('div');
    if(input_tags.length = 1) {
      formpotongan.removeChild(input_tags[(input_tags.length) - 1]);
      formpotongan.removeChild(input_tags[(input_tags.length) - 1]);
    }
  }

//   logic add form tunjangan
add_more_fields1.onclick = function() {
    var newntunjangan = document.createElement('input');
    newntunjangan.setAttribute('type','text');
    newntunjangan.setAttribute('class','form-control form-control-sm');
    newntunjangan.setAttribute('placeholder','tambahakan tunjangan');
    newntunjangan.setAttribute('name','ntunjangan');
    newntunjangan.setAttribute('id','ntunjangan');
    newntunjangan.setAttribute('autocomplete','off');
    var newjtunjangan = document.createElement('input');
    newjtunjangan.setAttribute('type','text');
    newjtunjangan.setAttribute('class','form-control form-control-sm');
    newjtunjangan.setAttribute('placeholder','Rp');
    newjtunjangan.setAttribute('name','jtunjangan');
    newjtunjangan.setAttribute('id','jtunjangan');
    newjtunjangan.setAttribute('value','');
    newjtunjangan.setAttribute('autocomplete','off');
    var bungkus = document.createElement("div")
    bungkus.setAttribute('class', 'col-sm-6 mt-3')
    var bungkus1 = document.createElement("div")
    bungkus1.setAttribute('class', 'col-sm-6 mt-3')
    bungkus.appendChild(newntunjangan)
    bungkus1.appendChild(newjtunjangan)
    formtunjangan.appendChild(bungkus);
    formtunjangan.appendChild(bungkus1);
    // logic rupiah
    const tunjang = formtunjangan.getElementsByTagName('input');
    for (let i = 0; i < tunjang.length; i++) {
      if ([i]%2!=0) {
        if (tunjang[i].value.length > 0) {
          tunjang[i].value = (formatRupiah(tunjang[i].value));
        }
        tunjang[i].addEventListener('keyup', function(e) {
          tunjang[i].value = formatRupiah(this.value);
        });
      }
    }
}

// logic remove form tunjangan
remove_fields1.onclick = function(){
    var input_tags = formtunjangan.getElementsByTagName('div');
    if(input_tags.length = 1) {
      formtunjangan.removeChild(input_tags[(input_tags.length) - 1]);
      formtunjangan.removeChild(input_tags[(input_tags.length) - 1]);
    }
  }

// logic calculate
document.getElementById('kalkulasi1').onclick = function() {calculate(); this.onclick=null;}
function calculate() {
  //kalkulasi form potongan-------------------------------------------------------
  const potong = formpotongan.getElementsByTagName('input')
  let bilpot = 0
  for (let i = 0; i < potong.length; i++) {
      if ([i]%2!=0) { 
        var inpot = potong[i].value.replaceAll('.', '')  
        let cal = parseInt(inpot)
        bilpot += cal
      }
  }
  // end calculate----------------------------------------------------------------

  // kalkulasi form tunjangan-----------------------------------------------------
  const tunjang = formtunjangan.getElementsByTagName('input')
  let biltun = 0
  for (let i = 0; i < tunjang.length; i++) {
    if ([i]%2!=0) {
      var intun = tunjang[i].value.replaceAll('.', '')
      let cal = parseInt(intun)
      biltun += cal
    }
  }
 // end calculate----------------------------------------------------------------

  var totalpot = document.getElementById('tpotongan')
  var totaltun = document.getElementById('ttunjangan')
  var gajikotor = document.getElementById("gajikotor").value
  var tpotongan = parseInt(document.getElementById('tpotongan').value)
  var ttunjangan = parseInt(document.getElementById('ttunjangan').value)
  var gajibersih = document.getElementById('gjbersih')
 // convert gj kotor hilangkan titik
  var calgjktr = gajikotor.replaceAll('.', '')
  var intgjktr = parseInt(calgjktr)

// kalkulasi
  // totalpotongan
  var calpot = tpotongan + bilpot
  totalpot.value = calpot
  if (totalpot.value.length > 0) {
    totalpot.value = (formatRupiah(totalpot.value));
  }
  totalpot.addEventListener('keyup', function(e) {
    totalpot.value = formatRupiah(this.value);
  });
  // totaltunjangan
  var caltun = ttunjangan + biltun
  totaltun.value = caltun
  if (totaltun.value.length > 0) {
    totaltun.value = (formatRupiah(totaltun.value));
  }
  totaltun.addEventListener('keyup', function(e) {
    totaltun.value = formatRupiah(this.value);
  });
  // gaji bersih
  gajibersih.value = intgjktr - calpot + caltun
  if (gajibersih.value.length > 0) {
    gajibersih.value = (formatRupiah(gajibersih.value));
  }
  gajibersih.addEventListener('keyup', function(e) {
    gajibersih.value = formatRupiah(this.value);
  });
}


// format rupiah -------------------------------------------------------------------
var gjktr = document.getElementById('gajikotor')
var gjbrsh = document.getElementById('gjbersih')
var potong = formpotongan.getElementsByTagName('input')
  // gaji kotor
  if (gjktr.value.length > 0) {
    gjktr.value = (formatRupiah(gjktr.value));
  }
  gjktr.addEventListener('keyup', function(e) {
    gjktr.value = formatRupiah(this.value);
  });
  
function formatRupiah(angka, prefix){
  var number_string = angka.replace(/[^,\d]/g, '').toString(),
      split    = number_string.split(','),
      sisa     = split[0].length % 3,
      rupiah     = split[0].substr(0, sisa),
      ribuan     = split[0].substr(sisa).match(/\d{3}/gi);
      
  if (ribuan) {
      var separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
  }
  
  rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
  return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
}