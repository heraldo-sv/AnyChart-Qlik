define([], function() {
  var self = this;
  self.rawData = [];

  self.loadData = function(view, $element, layout, hCubeWidth) {
    self.rawData.length = 0;
    var lastrow = 0;

    //loop through the rows we have
    view.backendApi.eachDataRow(function(index, row) {
      lastrow = index;
      self.rawData.push(row);
    });

    var rowCount = view.backendApi.getRowCount();
    if (rowCount > lastrow + 1) {
      //we havent got all the rows yet, so get some more, 1000 rows
      var requestPage = [{
        qTop: lastrow + 1,
        qLeft: 0,
        qWidth: hCubeWidth,
        qHeight: Math.min(1000, rowCount - lastrow)
      }];
      view.backendApi.getData(requestPage).then(function(dataPages) {
        view.paint($element, layout);
      });
      return false;
    }

    return true;
  };

  self.prepareData = function(view, layout) {
    var result = {data: [], dimensions: [], fieldNames: {}};
    var hc = layout.qHyperCube;
    var fieldKeys = [];
    var i;

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

    view.backendApi.eachDataRow(function(index, row) {
      //if (index == 3) console.log("Row:", index, row);
      var processedRow = {};

      for (var j = 0; j < row.length; j++) {
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

    return result;
  };

  return self;
});