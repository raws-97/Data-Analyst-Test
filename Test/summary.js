(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "currency_name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "high",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "low",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "last",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "buy",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "sell",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "servertime",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "last24",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "percentage",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "SummaryData",
            alias: "Summary Data From Indodax",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://indodax.com/api/summaries", function(resp) {       
           var feat = resp.tickers;
           var getName = (Object.keys(feat));
           var tableData = [];
           

            for(var j = 0; j<getName.length; j++){
                var high = feat[getName[j]].high,
                low = feat[getName[j]].low,
                last = feat[getName[j]].last,
                buy = feat[getName[j]].buy,
                sell = feat[getName[j]].sell,
                name = feat[getName[j]].name;

                var dateFormat = new Date((feat[getName[j]].server_time)*1000),
                year = dateFormat.getFullYear(),
                month = (dateFormat.getMonth())+1,
                days = dateFormat.getDate(),
                hours = dateFormat.getHours(),
                minutes = dateFormat.getMinutes(),
                seconds = dateFormat.getSeconds(),
                dateFixed = month+'/'+days+'/'+year+' '+hours+':'+minutes+':'+seconds;
                

                var x = (Object.values(getName)[j]);
                var y = x.replace(/_|-|\./g, '');
                last24 = resp.prices_24h[y];
                var percentage = (last-last24)/last24;
            
                    tableData.push({
                        "id": y,
                        "currency_name": getName[j],
                        "high": high,
                        "low": low,
                        "last": last,
                        "buy": buy,
                        "sell": sell,
                        "servertime": dateFixed,
                        "name": name,
                        "last24": last24,
                        "percentage": percentage
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
            tableau.connectionName = "Summary Data"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
