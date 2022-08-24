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

    var data = {"OkPercent": 99.89285714285714, "KoPercent": 0.10714285714285714};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6602586206896551, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.33, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.59, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.9625, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [0.955, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.935, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [0.9575, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.41, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.9375, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.94, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.965, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.955, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [0.7525, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.5925, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.4075, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.0, 500, 1500, "blazedemo_testing"], "isController": true}, {"data": [0.4225, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.195, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.3075, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.3725, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [0.455, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.3325, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [0.9625, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.95, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.965, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.965, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [0.96, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.6325, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5600, 6, 0.10714285714285714, 883.296785714285, 41, 12739, 477.0, 1868.7000000000016, 2622.7999999999993, 5126.809999999996, 267.1373372131851, 7236.265421516481, 331.0718773851548], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 200, 3, 1.5, 3957.4700000000003, 1709, 12739, 3786.0, 6176.400000000001, 7225.0999999999985, 12260.570000000002, 11.066843736166446, 3083.0213218307326, 41.41825709315516], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 200, 0, 0.0, 1355.9450000000002, 762, 3472, 1202.0, 2078.9, 2323.4499999999994, 3150.3600000000006, 11.811953697141508, 1036.6608898830618, 52.96922986061895], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 200, 0, 0.0, 652.6149999999999, 433, 2020, 557.5, 986.5000000000001, 1230.4999999999995, 1677.93, 12.403870007442322, 70.58335013024065, 8.83048948772017], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 200, 0, 0.0, 446.02500000000026, 312, 1994, 417.5, 761.4000000000001, 815.6999999999999, 1172.5600000000013, 12.472715933894607, 2.1318112722170253, 9.476340816962894], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 200, 0, 0.0, 419.8200000000002, 318, 1211, 418.0, 466.5, 757.9, 833.7900000000002, 12.47038284075321, 2.1555251589973814, 9.47456821299414], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 200, 0, 0.0, 430.03999999999996, 319, 1208, 422.0, 478.0, 779.3999999999999, 864.8500000000001, 12.32134056185313, 2.117730409068507, 9.361331012814194], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 200, 0, 0.0, 456.31500000000005, 319, 2169, 422.0, 730.1000000000001, 822.55, 1639.610000000005, 12.24739742804654, 17.257826852418862, 9.294626454378445], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 200, 0, 0.0, 160.56000000000006, 42, 981, 140.0, 204.50000000000009, 603.1999999999998, 835.8300000000011, 12.743723716069836, 2.663239135975532, 9.433342360137631], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 200, 0, 0.0, 1157.6749999999997, 763, 4384, 970.0, 1958.5000000000002, 2384.6499999999996, 3029.2700000000013, 12.23166778790288, 61.73193726683384, 56.702858387866186], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 200, 0, 0.0, 459.905, 312, 1967, 419.0, 768.8, 850.75, 1333.000000000001, 12.525050100200401, 2.152742985971944, 9.491639529058116], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 200, 0, 0.0, 451.8150000000001, 311, 1937, 422.5, 725.3000000000001, 833.5999999999999, 1287.5100000000014, 12.534469791927803, 2.380325191150664, 9.517995777450489], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 200, 0, 0.0, 419.65499999999986, 312, 869, 416.0, 461.0, 781.4499999999998, 832.96, 12.472715933894607, 2.1437480511381355, 9.476340816962894], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 200, 0, 0.0, 428.89999999999975, 317, 1113, 418.5, 483.9, 781.95, 984.1900000000007, 12.471160441479078, 2.1437242782315895, 9.450801272058365], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 200, 0, 0.0, 576.9900000000001, 106, 2502, 487.0, 1173.3000000000004, 1317.95, 2393.980000000002, 12.320581531448283, 1010.4440992114827, 8.518527074477914], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 200, 0, 0.0, 693.9450000000002, 435, 2718, 583.0, 1098.8000000000002, 1380.2499999999995, 2010.2000000000007, 12.187690432663011, 61.71208485679464, 9.212180073126143], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 200, 0, 0.0, 1205.900000000001, 777, 2723, 1041.5, 1809.8000000000002, 2110.95, 2607.1800000000007, 11.884247430031493, 93.19826452849247, 53.33624714035296], "isController": false}, {"data": ["blazedemo_testing", 200, 3, 1.5, 7676.990000000003, 5054, 16024, 7452.0, 9528.5, 9997.0, 15227.190000000004, 9.49622525046294, 3601.2969951866007, 164.76567507775033], "isController": true}, {"data": ["https://blazedemo.com/-5", 200, 1, 0.5, 1327.995, 334, 11099, 1058.5, 2161.6, 2680.749999999999, 7824.79000000002, 12.239902080783354, 48.5444796129131, 7.647368899173807], "isController": false}, {"data": ["https://blazedemo.com/-4", 200, 2, 1.0, 1990.0399999999993, 641, 10953, 1717.5, 3006.1, 3980.1, 10905.030000000039, 11.950286806883366, 1464.9429467166588, 7.40579346169933], "isController": false}, {"data": ["https://blazedemo.com/-3", 200, 0, 0.0, 1532.765, 433, 7857, 1309.0, 2504.6, 3017.449999999999, 6910.500000000022, 15.039855617386072, 579.9744322454504, 9.429284478869002], "isController": false}, {"data": ["https://blazedemo.com/-2", 200, 0, 0.0, 1422.1950000000004, 414, 6622, 1182.0, 2214.3, 3489.5499999999975, 5851.730000000001, 12.615908660821296, 357.0523915031855, 7.88494291301331], "isController": false}, {"data": ["https://blazedemo.com/-1", 200, 0, 0.0, 1220.4399999999998, 283, 6031, 1050.0, 2136.2000000000003, 2883.049999999997, 4551.630000000003, 15.209125475285171, 1247.3413735741444, 9.787903992395437], "isController": false}, {"data": ["https://blazedemo.com/-0", 200, 0, 0.0, 1492.1100000000001, 704, 6000, 1234.0, 2533.9000000000005, 2957.1999999999994, 5348.1500000000115, 14.085498978801326, 44.40233467145573, 8.487063349531658], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 200, 0, 0.0, 413.2250000000002, 310, 1809, 355.5, 457.9, 770.9, 1199.6300000000003, 12.679092177000127, 2.167084680486877, 9.633138392291112], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 200, 0, 0.0, 430.0799999999999, 311, 1951, 361.0, 498.5, 819.9, 1424.740000000003, 12.688745083111279, 2.1932694137799773, 9.64047233853572], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 200, 0, 0.0, 415.54, 309, 1771, 356.0, 462.8, 789.9, 1176.3400000000006, 12.680699974638602, 2.1794953081410093, 9.63435994166878], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 200, 0, 0.0, 410.6000000000002, 314, 1850, 355.0, 463.5, 767.6499999999999, 1098.850000000002, 12.688745083111279, 2.1808780611597514, 9.615689633295267], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 200, 0, 0.0, 141.04999999999995, 41, 1022, 118.0, 178.0, 542.0, 974.0000000000018, 12.912389437665441, 2.6984876363871133, 9.558194525146877], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 200, 0, 0.0, 662.6949999999999, 429, 4035, 552.0, 1022.5000000000006, 1279.2499999999993, 2591.970000000002, 12.490632025980515, 51.84100206095428, 10.721939014489132], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3, 50.0, 0.05357142857142857], "isController": false}, {"data": ["Assertion failed", 3, 50.0, 0.05357142857142857], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5600, 6, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3, "Assertion failed", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://blazedemo.com/", 200, 3, "Assertion failed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/-5", 200, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/-4", 200, 2, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
