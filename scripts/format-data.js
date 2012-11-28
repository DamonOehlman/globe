var fs = require('fs'),
    path = require('path'),
    data = require('../data/world.data'),
    outputLines = [],
    outputText = '';

data.forEach(function(val, index) {
    var lineIdx = Math.floor(index / 3);

    outputLines[lineIdx] = (outputLines[lineIdx] || []).concat(val);
});

// iterate through the output lines and convert the array data into strings
outputLines.forEach(function(data, index) {
    outputLines[index] = data.join(', ');
});

// write the output
fs.writeFileSync(
    path.resolve(__dirname, '../data/world.buffer.js'),
    'var worldData = [\n' + outputLines.join(', \n') + '\n];',
    'utf8');