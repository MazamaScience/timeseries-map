var dataset = d3.csv('data.csv');
dataset.then(function(data) {
    data.map(function(d) {
        d.val = +d.val; 
        return d;
    })
}); 
console.log(dataset)