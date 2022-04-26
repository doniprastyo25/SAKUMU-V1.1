function myFunction(chk) {
    var all = document.querySelectorAll('.text tr td');
    if(chk.classList.value.includes('All')){
      if(chk.checked){
        all.forEach(function(td){
          td.style.display = "block";
        });
      }
      else{
        all.forEach(function(td){
          td.style.display = "none";
        });
      }
    }
    if(chk.classList.value.includes('select-one')){
      document.querySelector('.All').checked = false;
      all.forEach(function(td){
        td.style.display = "none";
      });
      if(chk.checked){
        document.querySelector('.text-one').style.display = "block";
      }
      if(document.querySelector('.select-two').checked){
        document.querySelector('.text-two').style.display = "block";
      }
    }
    if(chk.classList.value.includes('select-two')){
      document.querySelector('.All').checked = false;
      all.forEach(function(td){
        td.style.display = "none";
      });
      if(chk.checked){
        document.querySelector('.text-two').style.display = "block";
      }
      if(document.querySelector('.select-one').checked){
        document.querySelector('.text-one').style.display = "block";
      }
    }
    
  }