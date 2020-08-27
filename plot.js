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
  buildGaugeCharts(newSample);
  buildBarChart(newSample);


}

init();

function buildGaugeCharts(sample) {

  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: result.wfreq,
        title: { text: "Belly Button Washing Frequency <br> Scrubs per Week", font: {size: 20 }},
        type: "indicator",
        mode: "gauge+number",
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
    Plotly.newPlot('gauge', gaugeData, layout);
  }
  )
}

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


function buildBarChart(sample) {
  d3.json('samples.json').then(data => {
    var records = data.samples
    var record = records.filter(sampleObj => sampleObj.id == sample)[0]

    var x = record.otu_ids.slice(0, 10)
    var y = record.sample_values.slice(0, 10)
    var otu_labels = record.otu_labels.slice(0, 10)

    var bar_trace = [{
      x: x,
      y: y,
      text: otu_labels,
      name: "Top 10",
      type: "bar"

    }]
    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot('bar', bar_trace, layout);

  })

}
function buildBubbleChart() {
  // object to store bacteria otu_ids and sample_values
  var bacteriaData = {}

  // this process is similar for the bar chart
  d3.json('samples.json').then((data) => {
    // bacteria data can be found in data.samples
    data.samples.forEach(bacteriaSample => {

      // the otu_ids for each row is stored in bacteriaSample.otu_ids 
      for (var i = 0; i < bacteriaSample.otu_ids.length; i++) {

        // if we haven't seen this strain of bacteria 
        if (!bacteriaData.hasOwnProperty(bacteriaSample.otu_ids[i])) {
          // add to our bacteria data with sample_value
          bacteriaData[bacteriaSample.otu_ids[i]] = bacteriaSample.sample_values[i]
        } else {
          // if we've seen this strain, add the sample_value to previous value
          bacteriaData[bacteriaSample.otu_ids[i]] = bacteriaSample.sample_values[i] + bacteriaData[bacteriaSample.otu_ids[i]]
        }
      }
    })

    // now bacteria data is filled with summation of values from every record

    // create top 10 bacteria

    var sortedBacteria = []

    for (var bacteria in bacteriaData) {
      // otu_id   //sample_value
      sortedBacteria.push([bacteria, bacteriaData[bacteria]])
    }

    // sorts all bacteria by sample_values
    sortedBacteria.sort(function (a, b) {
      return b[1] - a[1];
    });

    // remove the top 10 values from sorted bacteria and store in new array
    var top10Bacteria = sortedBacteria.slice(0, 10)
    var x = []
    var y = []

    // pushed otu_ids to separate array, pushed sample_values to separate array
    for (var j = 0; j < top10Bacteria.length; j++) {

      // otu_ids
      x.push(top10Bacteria[j][0])

      // sample_values
      y.push(top10Bacteria[j][1])
    }

    var trace1 = {
      x: x,
      y: y,
      //text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
      mode: 'markers',
      marker: {
        size: y,
        sizemode: 'area'
      }
    };

    var layout = {
      title: 'Bubble Chart Size Scaling',
      showlegend: false,
      height: 600,
      width: 600
    };
    var data = [trace1]
    Plotly.newPlot('bubble', data, layout);
  })
}

buildBubbleChart()

