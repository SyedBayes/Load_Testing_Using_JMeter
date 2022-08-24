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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7931034482758621, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1, 500, 1500, "https://blazedemo.com/"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.9, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.0, 500, 1500, "blazedemo_testing"], "isController": true}, {"data": [0.6, 500, 1500, "https://blazedemo.com/-5"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/-4"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/-3"], "isController": false}, {"data": [0.7, 500, 1500, "https://blazedemo.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://blazedemo.com/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 140, 0, 0.0, 493.7499999999995, 42, 2182, 341.5, 850.6, 1016.6999999999992, 1982.3300000000017, 11.60477453580902, 314.3189124150365, 14.39102132377321], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/", 5, 0, 0.0, 1730.8, 1465, 2182, 1667.0, 2182.0, 2182.0, 2182.0, 0.5212133847597206, 145.83387626394247, 1.9555681877410611], "isController": false}, {"data": ["https://blazedemo.com/purchase.php", 5, 0, 0.0, 869.0, 822, 1020, 829.0, 1020.0, 1020.0, 1020.0, 0.6175889328063241, 54.20187245244565, 2.76950037055336], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 5, 0, 0.0, 464.0, 424, 527, 455.0, 527.0, 527.0, 527.0, 0.6522306287503261, 3.7114725329376466, 0.4643321566005739], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 5, 0, 0.0, 327.2, 321, 340, 323.0, 340.0, 340.0, 340.0, 0.6590220113351786, 0.11262583201528932, 0.500702270330829], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 5, 0, 0.0, 330.8, 320, 345, 328.0, 345.0, 345.0, 345.0, 0.657116572479958, 0.11358362629780523, 0.49925458338809303], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 5, 0, 0.0, 325.2, 316, 339, 319.0, 339.0, 339.0, 339.0, 0.6622516556291391, 0.11382450331125828, 0.5031560430463576], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 5, 0, 0.0, 334.8, 319, 354, 327.0, 354.0, 354.0, 354.0, 0.659108884787767, 0.11392800059319799, 0.5007682737938307], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 5, 0, 0.0, 52.0, 49, 54, 53.0, 54.0, 54.0, 54.0, 0.6861534239055853, 0.1433953444490188, 0.507914350898861], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 5, 0, 0.0, 820.8, 794, 855, 807.0, 855.0, 855.0, 855.0, 0.6188118811881188, 3.123066212871287, 2.86865234375], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 5, 0, 0.0, 332.0, 316, 354, 327.0, 354.0, 354.0, 354.0, 0.6622516556291391, 0.11382450331125828, 0.501862582781457], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 5, 0, 0.0, 336.8, 323, 345, 339.0, 345.0, 345.0, 345.0, 0.6605019815059445, 0.11287875660501981, 0.5018267007926024], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 5, 0, 0.0, 328.8, 322, 335, 328.0, 335.0, 335.0, 335.0, 0.659108884787767, 0.11328433957289744, 0.5007682737938307], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 5, 0, 0.0, 329.0, 322, 337, 327.0, 337.0, 337.0, 337.0, 0.6578081831337982, 0.11306078147612156, 0.49849526378108144], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 5, 0, 0.0, 140.8, 116, 185, 133.0, 185.0, 185.0, 185.0, 0.6743088334457181, 55.30188490391099, 0.46622134187457853], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 5, 0, 0.0, 526.4, 481, 677, 486.0, 677.0, 677.0, 677.0, 0.6452445476835721, 3.267180644276681, 0.4877141405342625], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 5, 0, 0.0, 813.6, 775, 872, 809.0, 872.0, 872.0, 872.0, 0.6234413965087282, 4.10655490180798, 2.7987891599127184], "isController": false}, {"data": ["blazedemo_testing", 5, 0, 0.0, 4234.2, 4093, 4627, 4134.0, 4627.0, 4627.0, 4627.0, 0.4123371268349002, 156.3559029925367, 7.158720157100445], "isController": true}, {"data": ["https://blazedemo.com/-5", 5, 0, 0.0, 573.0, 334, 652, 634.0, 652.0, 652.0, 652.0, 0.6434178355424012, 2.5554495479989705, 0.4040211604040664], "isController": false}, {"data": ["https://blazedemo.com/-4", 5, 0, 0.0, 833.2, 619, 954, 918.0, 954.0, 954.0, 954.0, 0.5977286312014345, 73.99635292139868, 0.37416411386730425], "isController": false}, {"data": ["https://blazedemo.com/-3", 5, 0, 0.0, 780.2, 707, 886, 791.0, 886.0, 886.0, 886.0, 0.6070908207867897, 23.410939776590578, 0.38061748725109273], "isController": false}, {"data": ["https://blazedemo.com/-2", 5, 0, 0.0, 595.8, 429, 707, 694.0, 707.0, 707.0, 707.0, 0.6149305128520477, 17.403614446255073, 0.3843315705325298], "isController": false}, {"data": ["https://blazedemo.com/-1", 5, 0, 0.0, 292.0, 207, 341, 311.0, 341.0, 341.0, 341.0, 0.6453278265358802, 52.92507441436499, 0.4153037477413526], "isController": false}, {"data": ["https://blazedemo.com/-0", 5, 0, 0.0, 839.2, 726, 1182, 745.0, 1182.0, 1182.0, 1182.0, 0.577100646352724, 1.8192196156509697, 0.3477256824215143], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 5, 0, 0.0, 332.6, 321, 343, 332.0, 343.0, 343.0, 343.0, 0.6599788806758183, 0.11278935949049632, 0.5014292667634636], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 5, 0, 0.0, 325.2, 317, 336, 323.0, 336.0, 336.0, 336.0, 0.6618133686300464, 0.114395474851092, 0.5028230476505625], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 5, 0, 0.0, 337.2, 323, 350, 343.0, 350.0, 350.0, 350.0, 0.6593696426216538, 0.11332915732559673, 0.5009663886324673], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 5, 0, 0.0, 329.8, 317, 343, 333.0, 343.0, 343.0, 343.0, 0.660414740457007, 0.11350878351604808, 0.5004705455025756], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-1", 5, 0, 0.0, 49.8, 42, 53, 52.0, 53.0, 53.0, 53.0, 0.6857769853243725, 0.14331667466739814, 0.507635698120971], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 5, 0, 0.0, 475.0, 456, 522, 461.0, 522.0, 522.0, 522.0, 0.6464959917248513, 2.6832109031549005, 0.5549511491466252], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 140, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
