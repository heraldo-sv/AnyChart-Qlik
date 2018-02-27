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

  self.prepareData = function(view, layout, options) {
    var result = {data: [], dimensions: [], fieldNames: {}};
    var hc = layout.qHyperCube;
    var fieldKeys = [];
    var i;
    var tokens;
    
    if (options.tokens) {
      tokens = JSON.parse(options.tokens);
    } else {
      tokens = {
        dimCount: 0,
        measCount: 0
      };
    }
    
    for (i = 0; i < hc.qDimensionInfo.length; i++) {
      var dimestionId = tokens[hc.qDimensionInfo[i].cId];
      if (!dimestionId){
        dimestionId = tokens[hc.qDimensionInfo[i].cId] = "dimension" + tokens.dimCount;
        tokens.dimCount++;
      }

      fieldKeys.push(dimestionId);
      result.dimensions.push({'number': i, 'id': dimestionId, 'indexes': []});
      result.fieldNames[dimestionId] = hc.qDimensionInfo[i]['qFallbackTitle'];
    }

    for (i = 0; i < hc.qMeasureInfo.length; i++) {
      var measureId = tokens[hc.qMeasureInfo[i].cId];
      if (!measureId){
        measureId = tokens[hc.qMeasureInfo[i].cId] = "measure" + tokens.measCount;
        tokens.measCount++;
      }

      fieldKeys.push(measureId);
      result.fieldNames[measureId] = hc.qMeasureInfo[i]['qFallbackTitle'];
    }

    result.tokens = tokens;

    view.backendApi.eachDataRow(function(index, row) {
      // if (index === 3) console.log("Row:", index, row);
      var processedRow = {};
      var groupedDimValue = '';

      for (var j = 0; j < row.length; j++) {
        var value;
        if (row[j]['qState'] === 'O' || row[j]['qState'] === 'S' || row[j]['qIsOtherCell']) {
          // dimension
          value = row[j]['qText'];
          groupedDimValue = groupedDimValue ? groupedDimValue + '_' + value : value;

          result.dimensions[j]['indexes'].push(row[j]["qElemNumber"]);

        } else {
          // measure
          value = row[j]['qIsNull'] ?
              null :
              row[j]['qNum'] === 'NaN' ? row[j]['qText'] : row[j]['qNum'];
        }

        processedRow[fieldKeys[j]] = value;
      }

      if (result.dimensions.length > 1) {
        // Grouped dimensions field
        processedRow['dimensionGroup'] = groupedDimValue;
      }

      result.data.push(processedRow);
    });

    // console.log(result.data);
    return result;
  };

  return self;
});