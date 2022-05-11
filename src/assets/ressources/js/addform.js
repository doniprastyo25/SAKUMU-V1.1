// variable logic potongan
var formpotongan = document.getElementById('formpotongan')
var add_more_fields = document.getElementById('add_more_fields');
var remove_fields = document.getElementById('remove_fields');

// variable logic tunjangan
var formtunjangan = document.getElementById('formtunjangan')
var add_more_fields1 = document.getElementById('add_more_fields1')
var remove_fields1 = document.getElementById('remove_fields1')

// variable calculate gaji bersih
var gajikotor =document.getElementById('gajikotor').value
// var gajikotor = document.forms["formgaji"]["gajikotor"]
var tpotongan =document.getElementById('tpotongan').value
var ttunjangan =document.getElementById('ttunjangan').value
var formgaji =document.getElementsByName('formgaji').value
var gajibersih =document.getElementsByName('gajibersih').value

// console.log(gajikotor);

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

// logic remove form
remove_fields1.onclick = function(){
    var input_tags = formtunjangan.getElementsByTagName('div');
    if(input_tags.length = 1) {
      formtunjangan.removeChild(input_tags[(input_tags.length) - 1]);
      formtunjangan.removeChild(input_tags[(input_tags.length) - 1]);
    }
  }

// logic calculate 
function calculate() {
  var total = gajikotor - tpotongan + ttunjangan
  gajibersih.value = total
}