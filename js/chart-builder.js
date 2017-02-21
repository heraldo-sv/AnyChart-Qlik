var ACBuilder = (function() {

  function concatObjects() {
    var ret = {};
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
      for (p in arguments[i]) {
        if (arguments[i].hasOwnProperty(p)) {
          ret[p] = arguments[i][p];
        }
      }
    }
    return ret;
  }

  var getset = function(model, key, opt_value, opt_dryRun) {
    try {
      key = key.replace(/CALL_/g, "().").replace(/CALL/g, "()");
      var keyPath = key.split('.');
      var target = model;
      var name, matchResult, arg, useCall;
      var success = false;

      var str = "";

      for (var i = 0, count = keyPath.length; i < count; i++) {
        name = keyPath[i];
        matchResult = name.match(/(.+)\((.*)\)/);
        if (matchResult) {
          name = matchResult[1];
          arg = matchResult[2] ? matchResult[2] : undefined;
          useCall = true;
        } else {
          arg = undefined;
          useCall = false;
        }
        if (i != count - 1) {
          target = useCall ?
              target[name](arg) :
              target[name];

          str = name + "(" + arg ? arg : "" + ")";
        } else {
          if (opt_dryRun) {
            success = !!target[name];
          } else {
            target = useCall ?
                target[name](opt_value) :
                goog.isDef(opt_value) ? target[name] = opt_value : target[name];

            str = str ? str + "." : "";
            str += name + "(" + opt_value + ")";
          }
        }
      }
    } catch (e) {
      console.log('Can\'t get/set by key: ', key, ' and value: ', opt_value);
    }

    return opt_dryRun ? success : target;
  };

  var updateSelections = function() {
    for (var s = 0; s < chart.getSeriesCount(); s++) {
      chart.getSeriesAt(s).select(selectedIndexes);
    }
  };

  var chart;
  var selectedIndexes = [];

  this.buildChart = function(view, layout, typePreset, subtypePreset) {
    var i;
    var chartConstructor = subtypePreset.ctor || typePreset.ctor;
    var isSeriesBased = typePreset.isSeriesBased;
    var defaultSeriesType = isSeriesBased ? subtypePreset.seriesType : null;
    var presetSettings = subtypePreset.settings || {};
    var chartType = chart && chart.getType();
    var hc = layout.qHyperCube;
    var dimIndexes = [];
    selectedIndexes = [];

    // Prepare data
    var matrix = hc.qDataPages[0].qMatrix;
    //console.log(matrix);

    var data = matrix.map(function(d1) {
      dimIndexes.push(d1[0]['qElemNumber']);
      return d1.map(function(d2) {
        return Number(d2['qNum']) || (!isNaN(d2['qText']) ? Number(d2['qText']) : d2['qText']);
      });
    });

    //console.log("data: ", /*data,*/ dimIndexes);

    if (true || !chart || chartType != chartConstructor) {
      if (chart && typeof chart['dispose'] == 'function') {
        anychart.utils.hideTooltips();
        chart['dispose']();
      }

      // Create chart instance
      //console.log("create new chart!");
      chart = anychart[chartConstructor]();

      // Events
      var pointClicked = false;

      chart.interactivity().selectionMode('none');
      chart.listen("mouseDown", function(evt) {
        if (!pointClicked) {
          chart.dispatchEvent("pointMouseDown");
        }
        pointClicked = false;
      });

      chart.listen("pointMouseDown", function(evt) {
        if (evt.pointIndex != undefined) {
          pointClicked = true;
          view.selectValues(0, [dimIndexes[evt.pointIndex]], true);

          var index = selectedIndexes.indexOf(evt.pointIndex);
          if (index == -1) {
            selectedIndexes.push(evt.pointIndex);
          } else {
            selectedIndexes.splice(index, 1);
          }
        }

        if (isSeriesBased) {
          updateSelections();
        }
      });

      view.clearSelectedValues = function() {
        selectedIndexes = [];
        if (isSeriesBased) {
          updateSelections();
        }
      };
      //console.log("=====  anychart." + chartConstructor + "()");
    }

    // Applying panel chart settings
    var key;
    var value;
    var chartPanelSettings = layout.opt.chart;
    if (!isSeriesBased) {
      chartPanelSettings = concatObjects(chartPanelSettings, layout.opt.vary.chart, layout.opt.vary.both);
    }
    //console.log("Chart settings", chartPanelSettings);
    for (key in chartPanelSettings) {
      if (!isSeriesBased && (key.indexOf("xAxis") != -1 || key.indexOf("yAxis") != -1)) continue;

      value = chartPanelSettings[key];
      if (key == "paletteCALL") {
        value = anychart['palettes'][value];
      }
      getset(chart, key, value);
    }

    // Applying subtype settings
    for (key in presetSettings) {
      getset(chart, key, presetSettings[key]);
    }

    // Create data.set from prepared data
    var dataSet = anychart.data.set(data);

    if (isSeriesBased) {
      // Create series and apply panel series settings
      chart.removeAllSeries();

      for (i = 0; i < hc.qMeasureInfo.length; i++) {
        // Create series
        var seriesData;
        switch (defaultSeriesType) {
          case "bubble":
            seriesData = dataSet;
            break;
          default:
            seriesData = dataSet.mapAs({x: [0], value: [i + 1]});
            break;
        }

        // Create series and apply series settings
        var series = chart[defaultSeriesType](seriesData);
        series.name(hc.qMeasureInfo[i]['qFallbackTitle']);

        var seriesPanelSettings = hc.qMeasureInfo[i].series;
        seriesPanelSettings = concatObjects(seriesPanelSettings, layout.opt.vary.series, layout.opt.vary.both);

        //console.log("Series settings", seriesPanelSettings);
        for (key in seriesPanelSettings) {
          value = seriesPanelSettings[key];
          getset(series, key, value);
        }
      }
    } else {
      // Just add data to chart
      chart.data(dataSet);
    }

    // debug
    window['chart'] = chart;

    return chart;
  };

  return this;
})();
