// Load from CSV

// Load metadata
const metaUrl = "https://raw.githubusercontent.com/MazamaScience/timeseries-map/master/meta.csv";
const metaset = d3.csv(metaUrl);

// Load data
const dataUrl = "https://raw.githubusercontent.com/MazamaScience/timeseries-map/master/data.csv";
const dataset = d3.csv(dataUrl);

