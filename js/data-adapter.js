define([], function() {
  return {
    prepareData: function(view, layout) {
      var result = {data: [], dimensions: [], fieldNames: {}};

      var hc = layout.qHyperCube;
      var i;

      var fieldKeys = [];
      for (i = 0; i < hc.qDimensionInfo.length; i++) {
        var dimId = "dim_" + hc.qDimensionInfo[i].cId;
        fieldKeys.push(dimId);
        result.dimensions.push({'number': i, 'id': dimId, 'indexes': []});
        result.fieldNames[dimId] = hc.qDimensionInfo[i]['qFallbackTitle'];
      }

      for (i = 0; i < hc.qMeasureInfo.length; i++) {
        var measId = "meas_" + hc.qMeasureInfo[i].cId;
        fieldKeys.push(measId);
        result.fieldNames[measId] = hc.qMeasureInfo[i]['qFallbackTitle'];
      }

      // var matrix = hc.qDataPages[0].qMatrix;
      // data = matrix.map(function(d1) {
      //   return d1.map(function(d2) {
      //     return d2['qNum'];
      //   });
      // });

      view.backendApi.eachDataRow(function(index, row) {
        // if (index == 3) console.log("Normal cell", index, row);

        var processedRow = {};
        for (var j = 0; j < row.length; j++) {
          // if (row[j]['qIsOtherCell']) console.log("Other cell", index, row);

          var value;
          if (row[j]['qState'] == 'O' || row[j]['qIsOtherCell']) {
            // dimension
            value = row[j]['qText'];
            result.dimensions[j]['indexes'].push(row[j]["qElemNumber"]);

          } else {
            // measure
            value = row[j]['qIsNull'] ?
                null :
                row[j]['qNum'] == 'NaN' ? row[j]['qText'] : row[j]['qNum'];
          }

          processedRow[fieldKeys[j]] = value;
        }

        result.data.push(processedRow);
      });

      // console.log(result.dimensions[0].indexes);
      // console.log(result.data[result.data.length - 1]);

      return result;
    }
  };
});