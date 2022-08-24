/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7817241379310345, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.035, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.495, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.835, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.995, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.995, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [0.995, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.755, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.0, 500, 1500, "blazedemo_testing"], "isController": true}, {"data": [0.555, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.615, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.645, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.775, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2800, 0, 0.0, 505.1017857142845, 41, 2523, 343.0, 891.9000000000001, 1051.8999999999996, 1844.7399999999943, 198.04781440090537, 5364.186390401755, 245.59807787522988], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 100, 0, 0.0, 1769.5399999999997, 1424, 2523, 1735.5, 2050.4, 2128.5, 2521.6999999999994, 8.669267446900736, 2425.6339401820546, 32.52668508885999], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 100, 0, 0.0, 892.3199999999999, 767, 1743, 850.5, 1051.6, 1090.35, 1737.1899999999969, 10.091835704914724, 885.6965574225451, 45.25557573922696], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 100, 0, 0.0, 500.5, 424, 765, 478.0, 586.8, 708.9, 764.8499999999999, 10.542962572482868, 59.993987216657885, 7.505683315761729], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 100, 0, 0.0, 334.2699999999999, 314, 517, 331.0, 347.9, 356.84999999999997, 515.4699999999992, 10.640561821664184, 1.8184553894445628, 8.084333102787827], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 100, 0, 0.0, 334.6799999999999, 313, 486, 331.0, 351.0, 359.95, 484.9899999999995, 10.62473438164046, 1.8365019390140245, 8.072307957926052], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 100, 0, 0.0, 333.3300000000001, 313, 374, 332.0, 346.8, 351.95, 373.96, 10.654165778819518, 1.831184743234605, 8.094668921798425], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 100, 0, 0.0, 333.2699999999998, 313, 382, 331.0, 346.9, 349.0, 381.87999999999994, 10.660980810234541, 1.8427671908315564, 8.099846748400852], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 100, 0, 0.0, 53.96999999999998, 42, 290, 51.0, 61.900000000000006, 65.89999999999998, 287.8499999999989, 10.993843447669306, 2.297541501759015, 8.138020833333334], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 100, 0, 0.0, 856.0999999999998, 768, 1157, 833.5, 960.4000000000001, 1000.4999999999999, 1156.6299999999999, 10.017028949213664, 50.554692978062704, 46.43636369327857], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 100, 0, 0.0, 336.13, 311, 544, 332.0, 352.8, 358.95, 542.3899999999992, 10.675776662752215, 1.8348991139105368, 8.090237002241912], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 100, 0, 0.0, 333.8, 316, 361, 333.0, 349.9, 351.95, 360.98, 10.654165778819518, 1.8207802844662264, 8.094668921798425], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 100, 0, 0.0, 333.17999999999995, 315, 374, 333.0, 344.9, 348.9, 373.8599999999999, 10.640561821664184, 1.8288465630985316, 8.084333102787827], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 100, 0, 0.0, 333.43, 313, 381, 331.5, 346.0, 362.95, 380.93999999999994, 10.623605651758206, 1.8259322213959417, 8.050701157973016], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 100, 0, 0.0, 162.71, 93, 979, 140.5, 196.9, 413.49999999999784, 973.9499999999974, 10.843634786380395, 889.3157158154414, 7.49735686402082], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 100, 0, 0.0, 534.4699999999998, 425, 817, 499.5, 675.6, 732.7499999999998, 816.4599999999997, 10.447137484329295, 52.8988357971166, 7.896566809444213], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 100, 0, 0.0, 846.5400000000001, 743, 1143, 821.0, 932.4000000000001, 1083.3999999999996, 1142.5699999999997, 10.180189351521937, 67.05603239845261, 45.70149457904917], "isController": false}, {"data": ["blazedemo_testing", 100, 0, 0.0, 4364.499999999999, 3859, 5361, 4305.0, 4719.6, 4919.099999999999, 5359.169999999999, 7.036802476954471, 2668.315642372106, 122.16823675321933], "isController": true}, {"data": ["https://blazedemo.com/-5", 100, 0, 0.0, 610.5299999999997, 329, 1102, 630.0, 674.7, 703.6499999999999, 1098.4799999999982, 10.277492291880781, 40.81890737410072, 6.453542523124358], "isController": false}, {"data": ["https://blazedemo.com/-4", 100, 0, 0.0, 930.5799999999997, 589, 1256, 953.0, 1194.7, 1214.8, 1255.92, 9.78952520802741, 1211.9030684043073, 6.128013338228096], "isController": false}, {"data": ["https://blazedemo.com/-3", 100, 0, 0.0, 669.9899999999999, 391, 916, 723.5, 819.1000000000001, 864.95, 915.89, 10.055304172951233, 387.75766716943184, 6.304204374057315], "isController": false}, {"data": ["https://blazedemo.com/-2", 100, 0, 0.0, 633.3999999999997, 378, 912, 696.5, 780.8, 840.3999999999999, 911.98, 10.055304172951233, 284.5827834338864, 6.28456510809452], "isController": false}, {"data": ["https://blazedemo.com/-1", 100, 0, 0.0, 308.3300000000001, 225, 645, 292.0, 364.0, 545.649999999998, 644.96, 10.551862403714255, 865.386676295241, 6.790700511765326], "isController": false}, {"data": ["https://blazedemo.com/-0", 100, 0, 0.0, 809.0000000000001, 686, 1311, 763.5, 987.0000000000002, 1099.1499999999996, 1310.7499999999998, 9.46521533364884, 29.83761239943209, 5.703161973497397], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 100, 0, 0.0, 332.5800000000001, 311, 421, 330.5, 350.0, 355.9, 420.4099999999997, 10.524100189433803, 1.7985522784676908, 7.995849557987792], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 100, 0, 0.0, 332.2699999999999, 313, 419, 329.5, 345.0, 349.0, 418.47999999999973, 10.529640939243972, 1.8200648889122881, 8.000059229230283], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 100, 0, 0.0, 329.8299999999999, 314, 358, 328.0, 341.9, 346.0, 357.99, 10.538518284329223, 1.811307830119085, 8.006803930867319], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 100, 0, 0.0, 332.53000000000003, 313, 355, 332.5, 345.9, 352.0, 354.99, 10.529640939243972, 1.8097820364325576, 7.979493524270822], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 100, 0, 0.0, 53.08000000000001, 41, 336, 49.5, 57.0, 63.94999999999999, 333.4299999999987, 10.85894233901618, 2.2693492778803344, 8.038162395482681], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 100, 0, 0.0, 512.49, 424, 805, 483.0, 614.8, 661.0, 804.5999999999998, 10.366991499066971, 43.027064327182245, 8.89900930437487], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
