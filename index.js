'use strict';

// Requires
const path = require('path');
const fs = require('fs');

// Constants
// TODO make configurable as argument
const oflFixturesDirectory = '../open-fixture-library/fixtures';

// TODO make configurable as argument
const sqlFilPath = 'import.sql';

// Global variables
var sql = '';

// Process a single fixture file
function processFixture(oflFixture, manufacturerShortName) {
    // Map the OFL fixture to a Show Designer fixture
    let sdFixture = {};

    sdFixture.shortName = oflFixture.shortName;
    sdFixture.name = oflFixture.name;

    sql += "DELETE FROM fixture WHERE name = '" + oflFixture.name + "' AND manufacturer = '" + manufacturerShortName + "';\n";
    sql += "INSERT INTO fixture(name, object) VALUES('" + oflFixture.name + "', '" + JSON.stringify(sdFixture) + "');\n";
}

// Process all fixture files inside a manufacturer directory
function processManufacturer(shortName, manufacturer) {
    let filePath = oflFixturesDirectory + '/' + shortName;

    // Create the SQL for the manufacturer
    sql += "-- " + shortName + "\n";
    sql += "DELETE FROM manufacturer WHERE short_name = '" + shortName + "';\n";
    sql += "INSERT INTO manufacturer(short_name, name, website) VALUES('" + shortName + "', '" + manufacturer.name + "', '" + manufacturer.website + "');\n";

    // Process each fixture for this manufacturer
    const directoryPath = path.join(__dirname, filePath);

    let files = fs.readdirSync(directoryPath);
    
    for(let file of files) {
        processFixture(JSON.parse(fs.readFileSync(filePath + '/' + file)), shortName);
    }

    sql += "\n";
}

// Main processing method
function main() {
    // Write the initial SQL script
    sql += "-- ####################\n";
    sql += "-- # Generated with show-designer-ofl-import\n";
    sql += "-- # Time: " + new Date() + "\n";
    sql += "-- ####################\n";
    sql += "\n";
    sql += "DELETE FROM manufacturer;\n";
    sql += "DELETE FROM fixture;\n";
    sql += "\n";

    // Read the manufacturer file
    let manufacturers = JSON.parse(fs.readFileSync(oflFixturesDirectory + '/manufacturers.json'));

    // Process each manufacturer
    for (let manufacturer in manufacturers) {
        if (manufacturer != '$schema') {
            processManufacturer(manufacturer, manufacturers[manufacturer]);
        }
    }

    // Write the output to the SQL file
    fs.writeFileSync(sqlFilPath, sql);

    console.log('Finished');
}

main();