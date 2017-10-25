define([], function() {
  return {
    prepareData: function(view, layout) {
      var result = {data: [], dimensions: []};

      var hc = layout.qHyperCube;
      var i;

      var fieldNames = [];
      for (i = 0; i < hc.qDimensionInfo.length; i++) {
        var dimId = "dim_" + hc.qDimensionInfo[i].cId;
        fieldNames.push(dimId);
        result.dimensions.push({'number': i, 'id': dimId, 'indexes': []});
      }

      for (i = 0; i < hc.qMeasureInfo.length; i++) {
        fieldNames.push("meas_" + hc.qMeasureInfo[i].cId);
      }

      // var matrix = hc.qDataPages[0].qMatrix;
      // data = matrix.map(function(d1) {
      //   return d1.map(function(d2) {
      //     return d2['qNum'];
      //   });
      // });

      view.backendApi.eachDataRow(function(index, row) {
        // if (index == 1) console.log(index, row);

        var processedRow = {};
        for (var j = 0; j < row.length; j++) {
          var value;
          if (row[j]['qState'] == 'O') {
            // dimension
            value = row[j]['qText'];
            result.dimensions[j]['indexes'].push(row[j]["qElemNumber"]);
          } else {
            // measure
            value = row[j]['qIsNull'] ?
                null :
                row[j]['qNum'] == 'NaN' ? row[j]['qText'] : row[j]['qNum'];
          }

          processedRow[fieldNames[j]] = value;
        }

        result.data.push(processedRow);
      });

      // console.log(result.data[1]);

      return result;
    }
  };
});