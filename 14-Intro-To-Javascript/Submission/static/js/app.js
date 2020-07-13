// Global Variables
var tableData = data;
// JavaScript
$(document).ready(function() {
    // Initialize
    populateStateFilter();
    populateCountryFilter();
    populateShapeFilter();
    buildTable();

    //Event Listeners
    $('#filter-btn').on("click", function(event) {
        event.preventDefault();
        buildTable();
    });
    $('#form').on("submit", function(event) {
        event.preventDefault();
        buildTable();
    });
    $('#stateFilter, #countryFilter, #shapeFilter').on("change", function(event) {
        event.preventDefault();
        buildTable();
    });
});

// Make the dynamic filters
function populateStateFilter() {
    var states = [...new Set(tableData.map(x => x.state))];
    states.sort();

    states.forEach(function(state) {
        let state_name = `<option>${state}</option>`
        $('#stateFilter').append(state_name);
    });
}

function populateCountryFilter() {
    var countries = [...new Set(tableData.map(x => x.country))];
    countries.sort();

    countries.forEach(function(country) {
        let country_name = `<option>${country}</option>`
        $('#countryFilter').append(country_name);
    });
}

function populateShapeFilter() {
    var shapes = [...new Set(tableData.map(x => x.shape))];
    shapes.sort();

    shapes.forEach(function(shape) {
        let shape_name = `<option>${shape}</option>`
        $('#shapeFilter').append(shape_name);
    });
}

// Function to build the table
function buildTable() {
    //get filters
    var inputValue = $('#datetime').val();
    var stateFilter = $('#stateFilter').val();
    var countryFilter = $('#countryFilter').val();
    var shapeFilter = $('#shapeFilter').val();


    var sub_data = tableData;
    if (inputValue !== "") {
        sub_data = tableData.filter(x => x.datetime === inputValue);
    }
    if (stateFilter != "All") {
        sub_data = sub_data.filter(x => x.state === stateFilter);
    }
    if (countryFilter != "All") {
        sub_data = sub_data.filter(x => x.country === countryFilter);
    }
    if (shapeFilter != "All") {
        sub_data = sub_data.filter(x => x.shape === shapeFilter);
    }

    // Clearing/Appending to the datatable
    $('#ufo-table').DataTable().clear().destroy(); //clear datatable
    $('#ufo-table tbody').empty();
    sub_data.forEach(function(thing) {
        let row = "<tr>"
        Object.entries(thing).forEach(function([key, value]) {
            row += `<td>${value}</td>`;
        });
        row += "</tr>";
        $('#ufo-table tbody').append(row);
    });
    $('#ufo-table').DataTable({
            dom: 'Bfrtip',
            buttons: [
                'copyHtml5',
                'csvHtml5',
            ]
        }) //rebuild it

}


function init() {

    populateStateFilter();
    populateCountryFilter();
    populateShapeFilter();
    buildTable();
};