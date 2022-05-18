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
    newjpotongan.setAttribute('type','number');
    newjpotongan.setAttribute('class','form-control form-control-sm');
    newjpotongan.setAttribute('placeholder','Rp');
    newjpotongan.setAttribute('name','jtpotongan');
    newjpotongan.setAttribute('id','jtpotongan');
    newjpotongan.setAttribute('value','0')
    newjpotongan.setAttribute('autocomplete','off');
    var bungkus = document.createElement("div")
    bungkus.setAttribute('class', 'col-sm-6 mt-3')
    var bungkus1 = document.createElement("div")
    bungkus1.setAttribute('class', 'col-sm-6 mt-3')
    bungkus.appendChild(newnpotongan)
    bungkus1.appendChild(newjpotongan)
    formpotongan.appendChild(bungkus);
    formpotongan.appendChild(bungkus1);
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
    newjtunjangan.setAttribute('type','number');
    newjtunjangan.setAttribute('class','form-control form-control-sm');
    newjtunjangan.setAttribute('placeholder','Rp');
    newjtunjangan.setAttribute('name','jtunjangan');
    newjtunjangan.setAttribute('id','jtunjangan');
    newjtunjangan.setAttribute('value','0');
    newjtunjangan.setAttribute('autocomplete','off');
    var bungkus = document.createElement("div")
    bungkus.setAttribute('class', 'col-sm-6 mt-3')
    var bungkus1 = document.createElement("div")
    bungkus1.setAttribute('class', 'col-sm-6 mt-3')
    bungkus.appendChild(newntunjangan)
    bungkus1.appendChild(newjtunjangan)
    formtunjangan.appendChild(bungkus);
    formtunjangan.appendChild(bungkus1);
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
var kal = document.getElementById('kalkulasi1')
kal.onclick = function() {
  //kalkulasi form potongan-------------------------------------------------------
  const potong = formpotongan.getElementsByTagName('input')
  let bilpot = 0
  for (let i = 0; i < potong.length; i++) {
      if ([i]%2!=0) {
        let cal = parseInt(potong[i].value)
        bilpot += cal
      }
  }
  // end calculate----------------------------------------------------------------

  // kalkulasi form tunjangan-----------------------------------------------------
  const tunjang = formtunjangan.getElementsByTagName('input')
  let biltun = 0
  for (let i = 0; i < tunjang.length; i++) {
    if ([i]%2!=0) {
      let cal = parseInt(tunjang[i].value)
      biltun += cal
    }
  }
  // end calculate----------------------------------------------------------------
  var totalpot = document.getElementById('tpotongan')
  var totaltun = document.getElementById('ttunjangan')
  var gajikotor = parseInt(document.getElementById("gajikotor").value)
  var tpotongan = parseInt(document.getElementById('tpotongan').value)
  var ttunjangan = parseInt(document.getElementById('ttunjangan').value)
  var gajibersih = document.getElementById('gjbersih')
  var calpot = tpotongan + bilpot
  totalpot.value = calpot
  var caltun = ttunjangan + biltun
  totaltun.value = caltun
  console.log(calpot);
  gajibersih.value = gajikotor - calpot + caltun
  // console.log(gajibersih.value);
}

document.getElementById('gajikotor').onkeyup = function() {kalkulasi()}
document.getElementById('tpotongan').onkeyup = function() {kalkulasi()}
document.getElementById('ttunjangan').onkeyup = function() {kalkulasi()}
document.getElementById('gjbersih').onkeyup = function() {kalkulasi()}
formpotongan.getElementsByTagName('input').onkeyup = function() {kalkulasi()}
formtunjangan.getElementsByTagName('input').onkeyup = function() {kalkulasi()}
function kalkulasi() {
  //kalkulasi form potongan-------------------------------------------------------
  const potong = formpotongan.getElementsByTagName('input')
  let bilpot = 0
  for (let i = 0; i < potong.length; i++) {
      if ([i]%2!=0) {
        let cal = parseInt(potong[i].value)
        bilpot += cal
      }
  }
  // end calculate----------------------------------------------------------------

  // kalkulasi form tunjangan-----------------------------------------------------
  const tunjang = formtunjangan.getElementsByTagName('input')
  let biltun = 0
  for (let i = 0; i < tunjang.length; i++) {
    if ([i]%2!=0) {
      let cal = parseInt(tunjang[i].value)
      biltun += cal
    }
  }
  // end calculate----------------------------------------------------------------

  var totalpot = document.getElementById('tpotongan')
  var totaltun = document.getElementById('ttunjangan')
  var gajikotor = parseInt(document.getElementById("gajikotor").value)
  var tpotongan = parseInt(document.getElementById('tpotongan').value)
  var ttunjangan = parseInt(document.getElementById('ttunjangan').value)
  var gajibersih = document.getElementById('gjbersih')
  var calpot = tpotongan + bilpot
  totalpot.value = calpot
  var caltun = ttunjangan + biltun
  totaltun.value = caltun
  console.log(calpot);
  gajibersih.value = gajikotor - calpot + caltun
  // console.log(gajibersih.value);
}
