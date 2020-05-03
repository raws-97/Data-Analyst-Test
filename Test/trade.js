(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "date",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "price",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "amount",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "trade_id",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "type",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "TradeData",
            alias: "Trade Data From Indodax (Bitcoin)",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://indodax.com/api/trades/btcidr", function(resp) {
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = resp.length; i < len; i++) {
                var dateFormat = new Date(resp[i].date*1000),
                year = dateFormat.getFullYear(),
                month = (dateFormat.getMonth())+1,
                days = dateFormat.getDate(),
                hours = dateFormat.getHours(),
                minutes = dateFormat.getMinutes(),
                seconds = dateFormat.getSeconds(),
                dateFixed = month+'/'+days+'/'+year+' '+hours+':'+minutes+':'+seconds;
                
                tableData.push({
                    "id": "btcidr",
                    "date": dateFixed,
                    "price": resp[i].price,
                    "amount": resp[i].amount,
                    "trade_id": resp[i].tid,
                    "type": resp[i].type

                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Trade Data"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
