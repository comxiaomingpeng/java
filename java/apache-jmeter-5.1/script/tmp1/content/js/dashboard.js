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
    cell.colSpan = 6;
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

    var data = {"OkPercent": 27.272727272727273, "KoPercent": 72.72727272727273};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.22727272727272727, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "\u83B7\u53D6\u6CE8\u518C\u624B\u673A\u9A8C\u8BC1\u7801\u63A5\u53E3"], "isController": false}, {"data": [0.0, 500, 1500, "\u8BBE\u7F6E\u4EA4\u6613\u5BC6\u7801\u63A5\u53E3"], "isController": false}, {"data": [0.5, 500, 1500, "\u7528\u6237\u5BC6\u7801\u767B\u5F55\u63A5\u53E3"], "isController": false}, {"data": [1.0, 500, 1500, "\u6E38\u620F\u5217\u8868\u63A5\u53E3"], "isController": false}, {"data": [1.0, 500, 1500, "\u767B\u51FA\u63A5\u53E3"], "isController": false}, {"data": [0.0, 500, 1500, "\u70B9\u51FB\u53D1\u9001\u83B7\u53D6\u4EA4\u6613\u5BC6\u7801\u63A5\u53E3"], "isController": false}, {"data": [0.0, 500, 1500, "\u70B9\u51FB\u53D1\u9001\u4FEE\u6539\u5BC6\u7801\u9A8C\u8BC1\u7801\u63A5\u53E3"], "isController": false}, {"data": [0.0, 500, 1500, "getUserPublicKey"], "isController": false}, {"data": [0.0, 500, 1500, "\u6CE8\u518C\u5E76\u767B\u5F55\u63A5\u53E3"], "isController": false}, {"data": [0.0, 500, 1500, "\u652F\u4ED8\u5BC6\u7801\u6821\u9A8C\u63A5\u53E3"], "isController": false}, {"data": [0.0, 500, 1500, "\u4FEE\u6539\u5BC6\u7801\u63A5\u53E3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11, 8, 72.72727272727273, 116.0, 0, 1175, 945.6000000000008, 1175.0, 1175.0, 6.444053895723492, 8.132299904803748, 1.5360693101933216], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\u83B7\u53D6\u6CE8\u518C\u624B\u673A\u9A8C\u8BC1\u7801\u63A5\u53E3", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 63.639322916666664, 15.13671875], "isController": false}, {"data": ["\u8BBE\u7F6E\u4EA4\u6613\u5BC6\u7801\u63A5\u53E3", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["\u7528\u6237\u5BC6\u7801\u767B\u5F55\u63A5\u53E3", 1, 0, 0.0, 1175.0, 1175, 1175, 1175.0, 1175.0, 1175.0, 0.851063829787234, 0.9765625, 0.8111702127659575], "isController": false}, {"data": ["\u6E38\u620F\u5217\u8868\u63A5\u53E3", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 171.18778935185185, 6.004050925925926], "isController": false}, {"data": ["\u767B\u51FA\u63A5\u53E3", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 105.3466796875, 20.3857421875], "isController": false}, {"data": ["\u70B9\u51FB\u53D1\u9001\u83B7\u53D6\u4EA4\u6613\u5BC6\u7801\u63A5\u53E3", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 95.458984375, 22.705078125], "isController": false}, {"data": ["\u70B9\u51FB\u53D1\u9001\u4FEE\u6539\u5BC6\u7801\u9A8C\u8BC1\u7801\u63A5\u53E3", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 84.85243055555556, 20.182291666666668], "isController": false}, {"data": ["getUserPublicKey", 1, 1, 100.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 200.0, 175.78125, 50.0], "isController": false}, {"data": ["\u6CE8\u518C\u5E76\u767B\u5F55\u63A5\u53E3", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["\u652F\u4ED8\u5BC6\u7801\u6821\u9A8C\u63A5\u53E3", 1, 1, 100.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 250.0, 219.7265625, 68.115234375], "isController": false}, {"data": ["\u4FEE\u6539\u5BC6\u7801\u63A5\u53E3", 1, 1, 100.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 31.005859375, 9.870256696428571], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 3, 37.5, 27.272727272727273], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&quot;status&quot;:0\\\/", 3, 37.5, 27.272727272727273], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException\/Non HTTP response message: Illegal character in query at index 65: https:\\\/\\\/service.magicdapps.com\\\/api\\\/auth\\\/regist\\\/regAndLog?mobile=${mobile1_1}&amp;code=${code1_1}&amp;password=123456", 1, 12.5, 9.090909090909092], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException\/Non HTTP response message: Illegal character in query at index 87: https:\\\/\\\/service.magicdapps.com\\\/api\\\/auth\\\/editPass\\\/setTransCode?mobile=19853572622&amp;code=${jiaoyiCode_1}&amp;transcode=123456&amp;type=4", 1, 12.5, 9.090909090909092], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11, 8, "500\/Internal Server Error", 3, "Test failed: text expected to contain \\\/&quot;status&quot;:0\\\/", 3, "Non HTTP response code: java.net.URISyntaxException\/Non HTTP response message: Illegal character in query at index 65: https:\\\/\\\/service.magicdapps.com\\\/api\\\/auth\\\/regist\\\/regAndLog?mobile=${mobile1_1}&amp;code=${code1_1}&amp;password=123456", 1, "Non HTTP response code: java.net.URISyntaxException\/Non HTTP response message: Illegal character in query at index 87: https:\\\/\\\/service.magicdapps.com\\\/api\\\/auth\\\/editPass\\\/setTransCode?mobile=19853572622&amp;code=${jiaoyiCode_1}&amp;transcode=123456&amp;type=4", 1, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["\u83B7\u53D6\u6CE8\u518C\u624B\u673A\u9A8C\u8BC1\u7801\u63A5\u53E3", 1, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\u8BBE\u7F6E\u4EA4\u6613\u5BC6\u7801\u63A5\u53E3", 1, 1, "Non HTTP response code: java.net.URISyntaxException\/Non HTTP response message: Illegal character in query at index 87: https:\\\/\\\/service.magicdapps.com\\\/api\\\/auth\\\/editPass\\\/setTransCode?mobile=19853572622&amp;code=${jiaoyiCode_1}&amp;transcode=123456&amp;type=4", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\u70B9\u51FB\u53D1\u9001\u83B7\u53D6\u4EA4\u6613\u5BC6\u7801\u63A5\u53E3", 1, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\u70B9\u51FB\u53D1\u9001\u4FEE\u6539\u5BC6\u7801\u9A8C\u8BC1\u7801\u63A5\u53E3", 1, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["getUserPublicKey", 1, 1, "Test failed: text expected to contain \\\/&quot;status&quot;:0\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\u6CE8\u518C\u5E76\u767B\u5F55\u63A5\u53E3", 1, 1, "Non HTTP response code: java.net.URISyntaxException\/Non HTTP response message: Illegal character in query at index 65: https:\\\/\\\/service.magicdapps.com\\\/api\\\/auth\\\/regist\\\/regAndLog?mobile=${mobile1_1}&amp;code=${code1_1}&amp;password=123456", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\u652F\u4ED8\u5BC6\u7801\u6821\u9A8C\u63A5\u53E3", 1, 1, "Test failed: text expected to contain \\\/&quot;status&quot;:0\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["\u4FEE\u6539\u5BC6\u7801\u63A5\u53E3", 1, 1, "Test failed: text expected to contain \\\/&quot;status&quot;:0\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
