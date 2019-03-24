# show-designer-ofl-import
This node script generates the required SQL statements to import or update the fixtures from the OFL project (https://github.com/OpenLightingProject/open-fixture-library) to the Rocket Show Lighting Show Designer (https://github.com/moritzvieli/show-designer).

## Getting started
1. Clone both, the OFL project and the current repository to the same local folder. The folder for the OFL repository should be called "open-fixture-library".
2. Execute the node script with `node index.js``
3. An SQL file will be generated in the current directory with the name "import.sql".