// Load 
$(document).ready(function() {
    populateIDFilter();
});

// 
function populateIDFilter() {
    $.ajax({
        type: 'GET',
        url: "static/data/samples.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            console.log(data);
            data["names"].forEach(function(id) {
                // console.log(id); // Check if everything is printing correctly
                let option = `<option>${id}</option>`;
                $('#selDataset').append(option);
            });

            let initID = data["names"][0]

            optionChanged(initID);
        }
    });
}

// INCLUDE ALL PLOTS SO THEY WILL SHOW ON FRONT-END
function optionChanged(id) {
    loadMetaData(id);
    makeBar(id);
    makeBubble(id);
    makeGauge(id);
}

function loadMetaData(id) {
    $.ajax({
        type: 'GET',
        url: "static/data/samples.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            let metaData = data["metadata"].filter(x => x.id == id)[0];
            console.log(metaData);

            $('#sample-metadata').empty(); //clear the meta data table thing

            Object.entries(metaData).forEach(function([key, value]) {
                let info = `<p><b>${key.toUpperCase()}</b> : ${value} </p>`;
                $('#sample-metadata').append(info);
            });
        }
    });
}
// BAR PLOT
function makeBar(id) {
    $.ajax({
        type: 'GET',
        url: "static/data/samples.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            let sampleData = data["samples"].filter(x => x.id == id)[0];


            let plotData = sampleData["otu_ids"].map(function(e, i) {
                return [e, sampleData["sample_values"][i]]; //creates a list of list
            });
            let plotData_Sorted = plotData.sort((a, b) => b[1] - a[1]);
            x = plotData_Sorted.map(x => x[1]).slice(0, 10).reverse() //[1] corresponds to the sample_value
            y = plotData_Sorted.map(x => "OTU " + x[0]).slice(0, 10).reverse() //[0] corresponds to the OTU ID (the OTU is neccessary to append)

            // Y Axis needs to be a string  
            var traces = [{
                type: 'bar',
                x: x,
                y: y,
                orientation: 'h',

                marker: {
                    color: '#9D1490' // 
                }
            }];

            var layout = {
                title: 'OTU IDS To Values'
            };

            Plotly.newPlot('bar', traces, layout);
        }
    });
}
// TRY TO MODIFY TO SPEED INDICATOR
function makeGauge(id) {
    $.ajax({
        url: "static/data/samples.json",
        type: 'GET',
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {

            let metadata = data.metadata.filter(x => x.id == parseInt(id))[0];

            x = metadata.id
            y = metadata.wfreq

            var trace1 = {
                domain: {
                    x: [0, 9],
                    y: [0, 9]
                },
                value: y,
                title: {
                    text: `<b> Belly Button #${x} Wash Frequency </b>`,
                    font: {

                        size: "18"


                    }
                },
                type: 'indicator',
                mode: 'gauge+number',
                gauge: {
                    axis: {
                        range: [0, 9]
                    },
                    bar: {
                        color: "#9D1490"
                    }
                },
                number: {
                    prefix: `Subject #${x} Scrubs `,
                    suffix: "x Per Week",
                    font: {
                        size: 10
                    }
                },

            }

            var traces = [trace1];


            var layout = {
                height: 600,
                width: 400,
                margin: {
                    t: 0,
                    b: 20
                }
            };
            var config = { responsive: true };

            Plotly.newPlot("gauge", traces, layout, config);

        }
    });
}
// BUBBLE CHART (TRY THE COLORSCALE)
function makeBubble(id) {
    $.ajax({
        type: 'GET',
        url: "static/data/samples.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            let sampleData = data["samples"].filter(x => x.id == id)[0];

            var trace1 = {
                x: sampleData["otu_ids"],
                y: sampleData["sample_values"],
                mode: 'markers',
                marker: {
                    size: sampleData["sample_values"],
                    color: '#9D1490'
                }
            };

            var data = [trace1];

            var layout = {
                title: 'OTU IDS To Values',
                showlegend: false,
            };

            Plotly.newPlot('bubble', data, layout);
        }
    });
}