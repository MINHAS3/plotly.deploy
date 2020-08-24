function init() {
  var selector = d3.select("#selDataset");
  console.log(selector)
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  })
}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

init();

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        value: result.wfreq,
        gauge: {
          axis: { range: [null, 9] },
          steps: [
            { range: [0, 1], color: "lightgray" },
            { range: [1, 2], color: "gray" },
            { range: [2, 3], color: "gray" },
            { range: [3, 4], color: "gray" },
            { range: [4, 5], color: "gray" },
            { range: [5, 6], color: "gray" },
            { range: [6, 7], color: "gray" },
            { range: [7, 8], color: "gray" },
            { range: [8, 9], color: "gray" }, 
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 490
          }
        }
      }
    ];

var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
Plotly.newPlot('gauge', data, layout); 

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text("id: " + result.id);
    PANEL.append("h6").text("ethnicity: " + result.ethnicity);
    PANEL.append("h6").text("gender: " + result.gender);
    PANEL.append("h6").text("age: " + result.age);
    PANEL.append("h6").text("location: " + result.location);
    PANEL.append("h6").text("bbtype: " + result.bbtype);
    PANEL.append("h6").text("wfreq: " + result.wfreq);
  });
}

var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 11, 12, 13],
  text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
  mode: 'markers',
  marker: {
    size: [400, 600, 800, 1000],
    sizemode: 'area'
  }
};

var trace2 = {
  x: [1, 2, 3, 4],
  y: [14, 15, 16, 17],
  text: ['A</br>size: 40</br>sixeref: 0.2', 'B</br>size: 60</br>sixeref: 0.2', 'C</br>size: 80</br>sixeref: 0.2', 'D</br>size: 100</br>sixeref: 0.2'],
  mode: 'markers',
  marker: {
    size: [400, 600, 800, 1000],
    //setting 'sizeref' to lower than 1 decreases the rendered size
    sizeref: 2,
    sizemode: 'area'
  }
};

var trace3 = {
  x: [1, 2, 3, 4],
  y: [20, 21, 22, 23],
  text: ['A</br>size: 40</br>sixeref: 2', 'B</br>size: 60</br>sixeref: 2', 'C</br>size: 80</br>sixeref: 2', 'D</br>size: 100</br>sixeref: 2'],
  mode: 'markers',
  marker: {
    size: [400, 600, 800, 1000],
    //setting 'sizeref' to less than 1, increases the rendered marker sizes
    sizeref: 0.2,
    sizemode: 'area'
  }
};

// sizeref using above forumla
var desired_maximum_marker_size = 40;
var size = [400, 600, 800, 1000];
var trace4 = {
  x: [1, 2, 3, 4],
  y: [26, 27, 28, 29],
  text: ['A</br>size: 40</br>sixeref: 1.25', 'B</br>size: 60</br>sixeref: 1.25', 'C</br>size: 80</br>sixeref: 1.25', 'D</br>size: 100</br>sixeref: 1.25'],
  mode: 'markers',
  marker: {
    size: size,
    //set 'sizeref' to an 'ideal' size given by the formula sizeref = 2. * max(array_of_size_values) / (desired_maximum_marker_size ** 2)
    sizeref: 2.0 * Math.max(...size) / (desired_maximum_marker_size**2),
    sizemode: 'area'
  }
};

var data = [trace1, trace2, trace3, trace4];

var layout = {
  title: 'Bubble Chart Size Scaling',
  showlegend: false,
  height: 600,
  width: 600
};

Plotly.newPlot('bubble', data, layout)
