function BuildChart(labels, values, chartTitle) {
  var ctx = document.getElementById("myChart").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Sumber Kas', // Name the series
        data: values,
        // [-7000,1000,10000,-4000,-5000,1000], // Our values
        backgroundColor: [ // Specify custom colors
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [ // Add custom color borders
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1, // Specify bar border width
        hoverOffset: 2
      }]
    },options: {
          indexAxis: 'x',
        }
  });
  return myChart;
}

// HTML To JSON Script 
// *Forked* from https://johndyer.name/html-table-to-json/
var table = document.getElementById('dataTable1');
var json = []; // first row needs to be headers 
var headers = [];
for (var i = 0; i < table.rows[0].cells.length; i++) {
    headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
}
// go through cells 
for (var i = 1; i < table.rows.length; i++) {
    var tableRow = table.rows[i];
    var rowData = {};
    for (var j = 0; j < tableRow.cells.length; j++) {
        rowData[headers[j]] = tableRow.cells[j].innerHTML;
    }
    json.push(rowData);
}
console.log(json);
// Map json values back to label array
var labels = json.map(function (e) {
    return e.year;
});
console.log(labels);
// Map json values back to values array
var values = json.map(function (e) {
    return e.itemssold;
});
console.log(values);
var chart = BuildChart(labels, values, "Items Sold Over Time");