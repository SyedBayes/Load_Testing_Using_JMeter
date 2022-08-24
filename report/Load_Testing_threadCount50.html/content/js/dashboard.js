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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7858620689655172, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.88, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.99, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.98, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [0.98, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.98, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.98, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.97, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.99, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.97, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.87, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.0, 500, 1500, "blazedemo_testing"], "isController": true}, {"data": [0.65, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.61, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.6, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [0.98, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [0.99, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.97, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.99, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.88, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1400, 0, 0.0, 512.3421428571436, 41, 2306, 370.5, 907.0, 1115.95, 1828.7600000000002, 100.68320747932398, 2727.064511416757, 124.85672869471414], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 50, 0, 0.0, 1772.06, 1464, 2306, 1735.5, 2012.8999999999999, 2248.1499999999996, 2306.0, 4.379817799579538, 1225.4636105575507, 16.43287108006307], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 50, 0, 0.0, 888.2599999999999, 754, 1284, 854.5, 1086.0, 1192.9999999999995, 1284.0, 5.124000819840131, 449.70653085929496, 22.97794117647059], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 50, 0, 0.0, 474.82, 418, 603, 462.0, 535.8, 567.1499999999999, 603.0, 5.324246619103397, 30.297251024917475, 3.7904060403577895], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 50, 0, 0.0, 353.3399999999999, 314, 646, 337.0, 400.6, 448.5499999999997, 646.0, 5.4007344998919855, 0.9229770873838843, 4.103292422769497], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 50, 0, 0.0, 359.57999999999987, 316, 731, 336.0, 408.7, 504.04999999999944, 731.0, 5.38618980932888, 0.9310113244640742, 4.092241866853388], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 50, 0, 0.0, 355.94, 317, 692, 340.0, 408.9, 486.24999999999966, 692.0, 5.417705060136526, 0.9311680572109655, 4.116186071080291], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 50, 0, 0.0, 356.8799999999999, 320, 654, 338.0, 399.6, 492.24999999999983, 654.0, 5.405405405405405, 0.9343327702702703, 4.106841216216216], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 50, 0, 0.0, 51.980000000000004, 42, 96, 50.5, 60.8, 67.94999999999996, 96.0, 5.587840858292355, 1.1732283052078676, 4.136311885337506], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 50, 0, 0.0, 876.2400000000002, 768, 1253, 835.5, 1022.1999999999999, 1172.3999999999999, 1253.0, 5.100999795960008, 25.749089790348908, 23.646919952560705], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 50, 0, 0.0, 362.0600000000002, 315, 699, 337.5, 452.29999999999995, 533.6499999999993, 699.0, 5.4194667244743115, 0.9314708432690222, 4.106939627140689], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 50, 0, 0.0, 366.29999999999995, 317, 647, 337.5, 428.4, 560.5999999999999, 647.0, 5.408328826392645, 0.9242749459167118, 4.109062330989724], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 50, 0, 0.0, 349.6199999999999, 317, 664, 332.5, 399.3, 445.99999999999966, 664.0, 5.4007344998919855, 0.9282512421689351, 4.103292422769497], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 50, 0, 0.0, 354.44, 315, 617, 332.5, 423.2, 550.0999999999998, 617.0, 5.39490720759603, 0.9272496763055674, 4.088328118256365], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 50, 0, 0.0, 136.70000000000007, 93, 196, 135.0, 162.9, 182.49999999999994, 196.0, 5.525472427892585, 453.1642826555421, 3.820346170847608], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 50, 0, 0.0, 487.54, 422, 903, 475.5, 527.5, 593.5999999999995, 903.0, 5.313496280552604, 26.90517899840595, 4.016255977683316], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 50, 0, 0.0, 890.0000000000001, 763, 1165, 859.0, 1074.2, 1126.8, 1165.0, 5.135579293344289, 33.83263468056697, 23.054939464359077], "isController": false}, {"data": ["blazedemo_testing", 50, 0, 0.0, 4426.559999999999, 4057, 5046, 4388.0, 4750.1, 4867.849999999999, 5046.0, 3.5785857429144, 1356.9937028074005, 62.129001306183795], "isController": true}, {"data": ["https://blazedemo.com/-5", 50, 0, 0.0, 554.66, 328, 701, 621.5, 673.0, 685.3, 701.0, 5.034232782923882, 19.99436008608538, 3.1611442181836487], "isController": false}, {"data": ["https://blazedemo.com/-4", 50, 0, 0.0, 967.8799999999999, 638, 1286, 965.0, 1192.4, 1249.2999999999997, 1286.0, 4.90869821323385, 607.6767054658354, 3.072730033870018], "isController": false}, {"data": ["https://blazedemo.com/-3", 50, 0, 0.0, 681.1000000000004, 428, 1104, 724.5, 858.9, 908.9499999999998, 1104.0, 4.979087831109341, 192.00607448715397, 3.1216546753634735], "isController": false}, {"data": ["https://blazedemo.com/-2", 50, 0, 0.0, 686.5, 414, 1115, 717.0, 832.4, 867.7499999999998, 1115.0, 5.14668039114771, 145.66010196860526, 3.216675244467319], "isController": false}, {"data": ["https://blazedemo.com/-1", 50, 0, 0.0, 301.36, 219, 606, 295.0, 349.8, 464.8999999999991, 606.0, 5.240540823813018, 429.795995571743, 3.372574612199979], "isController": false}, {"data": ["https://blazedemo.com/-0", 50, 0, 0.0, 782.76, 697, 1233, 750.0, 926.1999999999999, 1119.7999999999995, 1233.0, 4.762358319839985, 15.012590484808076, 2.8695069173254595], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 50, 0, 0.0, 349.42000000000013, 313, 578, 333.0, 410.0, 449.64999999999975, 578.0, 5.365958360163125, 0.9170338994419404, 4.076870707233312], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 50, 0, 0.0, 339.03999999999996, 315, 424, 330.5, 392.79999999999995, 410.7, 424.0, 5.365958360163125, 0.927514286864134, 4.076870707233312], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 50, 0, 0.0, 360.92, 319, 679, 337.5, 437.7, 571.2999999999994, 679.0, 5.3516001284384025, 0.9198062720753505, 4.0659618163330835], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 50, 0, 0.0, 346.08, 316, 533, 332.5, 389.9, 420.4999999999999, 533.0, 5.367686527106818, 0.9225711218464843, 4.067699946323135], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 50, 0, 0.0, 49.56000000000001, 41, 69, 50.0, 56.0, 58.0, 69.0, 5.532197388802833, 1.1615453501880946, 4.0951226764770965], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 50, 0, 0.0, 490.53999999999996, 429, 907, 473.0, 554.0, 598.4999999999999, 907.0, 5.288766659614978, 21.95044756187857, 4.539869036915591], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
