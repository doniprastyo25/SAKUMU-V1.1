'use strict';
var inmenu = document.getElementById('inmenu');
var outmenu = document.getElementById('outmenu');
//in switch
var SwitchCheckIn = document.getElementById('SwitchCheckDBSiswaIn');
var DBsiswaIn = document.getElementById('dbSiswaIn');
//out switch
var SwitchCheckOut = document.getElementById('SwitchCheckDBSiswaOut');
var DBsiswaOut = document.getElementById('dbSiswaOut');

//event in
SwitchCheckIn.addEventListener('click',function(e) {
    SwitchCheckIn = getCheckedIn(this.checked)
});
//event out
SwitchCheckOut.addEventListener('click',function(e) {
    SwitchCheckOut = getCheckedOut(this.checked)
});

function getCheckedIn(status) {
    //console.log({in:status});
    if (status == true) {
        return DBsiswaIn.value = '1'
    }else if (status == false) {
        return DBsiswaIn.value = '0'
    }
}

function getCheckedOut(status) {
    //console.log({out:status});
    if (status == true) {
        return DBsiswaOut.value = '1'
    }else if (status == false) {
        return DBsiswaOut.value = '0'
    }
}

for (let i = 0; i < inmenu.value ; i++) {
    var switchEdit = document.getElementById('SwitchCheckIn'+(i+1));
    switchEdit.addEventListener('click',function(e) {
        var name = e.target.name;
        var str = name.split('In');
        var getNumb = str[1];
        getCheckedEdit(e.target.checked,getNumb, "In")
    })

}

for (let i = 0; i < outmenu.value; i++) {
    var switchEdit = document.getElementById('SwitchCheckOut'+(i+1));  

    switchEdit.addEventListener('click',function(e) {
        var name = e.target.name;        
        var str = name.split('Out');
        var getNumb = str[1];
        getCheckedEdit(e.target.checked,getNumb, "Out")
    })
}

function getCheckedEdit(status, no, menu) { 
    var dbSiswaEdit = document.getElementById('dbSiswaEdit'+menu+no);
    if (status == true) {
        dbSiswaEdit.value = '1'
    }else if (status == false) {
        dbSiswaEdit.value = '0'
    } 
}
