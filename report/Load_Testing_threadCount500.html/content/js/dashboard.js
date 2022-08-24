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

    var data = {"OkPercent": 97.4911712772219, "KoPercent": 2.5088287227781048};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4653349418109566, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.126, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.4102822580645161, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.744, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.744, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [0.5826612903225806, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.5756048387096774, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [0.8578629032258065, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.371, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.5877016129032258, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.6149193548387096, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.75, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.746, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [0.346, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.492, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.159, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.0, 500, 1500, "blazedemo_testing"], "isController": true}, {"data": [0.10435779816513761, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.013761467889908258, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.04128440366972477, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.06995412844036697, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [0.06536697247706422, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.08486238532110092, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [0.81, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.805, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.81, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.802, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [0.919, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.56, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13592, 341, 2.5088287227781048, 3085.011183048849, 41, 63804, 728.0, 8524.000000000007, 15714.699999999997, 29889.359999999986, 199.89705125376867, 5574.031983050224, 243.74956913192145], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 500, 180, 36.0, 21451.73399999998, 3321, 63804, 20230.5, 33976.4, 47345.05, 51829.31, 7.69029638402264, 1770.2132531203379, 23.666346397865176], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 500, 0, 0.0, 3785.5679999999975, 750, 24448, 2629.5, 8154.700000000003, 11021.749999999995, 17516.730000000003, 8.2387253044209, 655.6659355227059, 36.97079706577798], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 496, 0, 0.0, 1470.7116935483866, 425, 17008, 863.5, 2610.7000000000003, 4348.4, 13533.679999999978, 8.002839717319048, 45.53965973813288, 5.697334134692955], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 500, 0, 0.0, 622.0619999999991, 305, 7343, 493.5, 1100.9000000000003, 1383.2999999999997, 3119.3500000000004, 8.367640660039497, 1.684641404759514, 6.351823727281856], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 500, 0, 0.0, 618.6539999999995, 308, 5202, 493.0, 1167.4, 1471.5499999999997, 2916.250000000001, 8.367920739054759, 11.791086752326281, 6.350467348373276], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 496, 0, 0.0, 931.8770161290327, 314, 11753, 556.5, 1810.1000000000004, 2702.5, 5918.0599999999995, 8.137283853397644, 66.90092374987695, 6.037467803589592], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 496, 1, 0.20161290322580644, 1124.2943548387088, 312, 15047, 560.0, 2175.8, 3053.9499999999966, 11749.399999999994, 8.174297109331224, 199.08114478270545, 6.060648783331685], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 496, 0, 0.0, 556.0705645161291, 43, 22199, 236.0, 1267.5000000000002, 2003.75, 4702.459999999979, 8.202957033704891, 84.24845354724143, 6.022851426834915], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 500, 0, 0.0, 1462.3059999999998, 758, 20136, 1175.0, 2332.8, 2961.649999999999, 5814.720000000005, 8.771006560712909, 131.81005275212257, 40.60787598015998], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 496, 0, 0.0, 903.320564516129, 311, 13657, 551.5, 1769.1000000000004, 2288.7999999999993, 5353.21999999999, 8.137283853397644, 43.394644296313615, 6.039694764699609], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 496, 0, 0.0, 875.3205645161293, 315, 9882, 551.0, 1441.6, 2172.8999999999996, 4999.309999999995, 8.12621852319085, 7.6781040598325605, 6.035049693218867], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 500, 0, 0.0, 656.5479999999994, 309, 14761, 491.5, 1115.9, 1402.9999999999998, 4226.8700000000035, 8.366240546148182, 4.00742922160498, 6.350695548323405], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 500, 0, 0.0, 663.5759999999999, 309, 22155, 490.0, 1168.9000000000003, 1396.85, 3626.2100000000028, 8.365540664893171, 3.3204007303117002, 6.333825331693688], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 500, 0, 0.0, 2638.1540000000005, 42, 22419, 1633.0, 6649.800000000002, 8529.349999999999, 14767.850000000004, 8.386166180269027, 604.0859006794891, 5.848204364580188], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 500, 0, 0.0, 1003.4220000000003, 414, 12182, 688.0, 1770.0000000000005, 2434.3999999999996, 5995.580000000002, 8.283768783445717, 41.944669084146526, 6.261364295299789], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 500, 5, 1.0, 3187.0159999999983, 760, 24074, 2116.5, 6666.900000000006, 10709.499999999998, 16139.03, 7.980081716036771, 434.1060338395365, 34.94554155328301], "isController": false}, {"data": ["blazedemo_testing", 500, 180, 36.0, 29886.624000000007, 13715, 66779, 28472.0, 39597.700000000004, 50670.55, 56290.560000000005, 7.343437903889084, 2784.616622055282, 121.70831830223389], "isController": true}, {"data": ["https://blazedemo.com/-5", 436, 41, 9.403669724770642, 6115.598623853212, 395, 48418, 3350.0, 13297.1, 23625.35, 39099.789999999964, 7.951126105589497, 30.773285766390078, 4.523246586349959], "isController": false}, {"data": ["https://blazedemo.com/-4", 436, 38, 8.715596330275229, 10360.447247706408, 642, 58909, 8228.5, 21815.200000000004, 24969.64999999999, 45862.359999999986, 7.230274286093331, 818.8721909617426, 4.1315159012138905], "isController": false}, {"data": ["https://blazedemo.com/-3", 436, 44, 10.091743119266056, 7529.0917431192665, 483, 48079, 4597.0, 17404.50000000001, 23594.399999999998, 47573.65, 7.957075592218126, 278.200189288517, 4.48526526627003], "isController": false}, {"data": ["https://blazedemo.com/-2", 436, 31, 7.110091743119266, 6305.153669724774, 455, 48310, 3657.5, 14530.2, 19793.6, 31704.429999999997, 7.557897656358341, 200.210497227543, 4.387827624462626], "isController": false}, {"data": ["https://blazedemo.com/-1", 436, 1, 0.22935779816513763, 8562.66513761468, 257, 62514, 5653.5, 18365.100000000002, 24610.749999999993, 41417.08999999999, 6.875887084056143, 562.6656660276376, 4.414860259619934], "isController": false}, {"data": ["https://blazedemo.com/-0", 436, 0, 0.0, 5673.364678899083, 711, 37507, 3341.0, 14191.5, 19511.8, 31544.55, 10.938283993978928, 34.481231184144505, 6.5907433830908175], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 500, 0, 0.0, 495.33000000000004, 305, 3963, 465.0, 575.8000000000001, 1028.0, 1349.93, 8.96041289582624, 1.5313205632515545, 6.807813704055483], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 500, 0, 0.0, 501.86200000000025, 312, 2519, 465.0, 585.8000000000001, 1079.6999999999998, 2051.4600000000005, 8.958646885974343, 1.5485161121264246, 6.806471950476601], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 500, 0, 0.0, 497.4320000000006, 311, 3995, 467.5, 585.6000000000001, 1144.0499999999997, 1327.99, 8.96041289582624, 1.5400709664701349, 6.807813704055483], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 500, 0, 0.0, 510.3480000000004, 312, 3856, 467.0, 591.9000000000001, 1113.6, 2059.020000000002, 8.961697704013048, 1.5402917928772426, 6.791286541322388], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 500, 0, 0.0, 319.99400000000026, 41, 19281, 204.0, 715.0, 893.9, 2189.7000000000003, 9.005763688760807, 91.76885511414805, 6.612728239823487], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 500, 0, 0.0, 789.8440000000004, 420, 9850, 631.5, 1233.7, 1751.3999999999999, 3687.970000000001, 8.822699040090344, 36.61785416519622, 7.573391070546302], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ajax.googleapis.com:80 [ajax.googleapis.com/142.250.195.138] failed: Connection timed out: connect", 1, 0.2932551319648094, 0.0073572689817539725], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 1, 0.2932551319648094, 0.0073572689817539725], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: Connection reset", 7, 2.0527859237536656, 0.05150088287227781], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 215, 63.049853372434015, 1.5818128310771042], "isController": false}, {"data": ["Assertion failed", 117, 34.3108504398827, 0.8608004708652148], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13592, 341, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 215, "Assertion failed", 117, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: Connection reset", 7, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ajax.googleapis.com:80 [ajax.googleapis.com/142.250.195.138] failed: Connection timed out: connect", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://blazedemo.com/", 500, 180, "Assertion failed", 116, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 64, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 496, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 500, 5, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 4, "Assertion failed", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://blazedemo.com/-5", 436, 41, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 38, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: Connection reset", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/-4", 436, 38, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 37, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/-3", 436, 44, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 41, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: java.net.SocketException: Connection reset", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/-2", 436, 31, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 30, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: blazedemo.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://blazedemo.com/-1", 436, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ajax.googleapis.com:80 [ajax.googleapis.com/142.250.195.138] failed: Connection timed out: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
