define([], function() {
  return {
    prepareData: function(view, layout) {
      var data = [];
      var hc = layout.qHyperCube;
      var matrix = hc.qDataPages[0].qMatrix;
      var i;

      var fieldNames = [];
      for (i = 0; i < hc.qDimensionInfo.length; i++) {
        fieldNames.push("dim_" + hc.qDimensionInfo[i].cId)
      }

      for (i = 0; i < hc.qMeasureInfo.length; i++) {
        fieldNames.push("meas_" + hc.qMeasureInfo[i].cId)
      }

      // console.log(hc);
      // console.log(matrix);

      // data = matrix.map(function(d1) {
      //   //dimIndexes.push(d1[0]['qElemNumber']);
      //
      //   return d1.map(function(d2) {
      //     var num1 = Number(d2['qNum']);
      //     var num2 = Number(d2['qText']);
      //     var date = new Date(d2['qText']);
      //     var time = date.getTime();
      //     if (num1 && isNaN(num2) && time)
      //       num1 = time;
      //     return num1 || (!isNaN(num2) ? num2 : d2['qText']);
      //   });
      // });

      view.backendApi.eachDataRow(function(index, row) {
        //if (index == 1) console.log(row);

        var processedRow = {};
        for (var j = 0; j < row.length; j++) {
          var value;
          if (row[j]['qState'] == 'O') {
            // dimension
            value = row[j]['qText'];

          } else {
            // measure
            value = row[j]['qIsNull'] ?
                null :
                row[j]['qNum'] == 'NaN' ? row[j]['qText'] : row[j]['qNum'];
          }

          processedRow[fieldNames[j]] = value;
        }

        data.push(processedRow);
      });

      // console.log(data[0]);

      return data;
    }
  };
});