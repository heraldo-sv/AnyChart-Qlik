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

  var checkProperties = function(view, layout) {
    var consistency = true;
    var subtype = null;
    var seriesTypes = [];
    var i, key, value;

    /******** Check subtypePreset ***/
    var typePreset = getChartTypePreset(layout.opt.chartType);
    var subtypePreset = getSubtypePreset(typePreset, layout.opt.chartSubtype);

    // Set up default subtype
    if (!subtypePreset) {
      subtypePreset = getSubtypePreset(typePreset, typePreset.defaultSubtype);
      if (subtypePreset) {
        consistency = false;
        subtype = typePreset.defaultSubtype;
      }
    }

    /******** Check series types ***/
    if (typePreset.isSeriesBased) {
      var hc = layout.qHyperCube;
      for (i = 0; i < hc.qMeasureInfo.length; i++) {
        var settings = hc.qMeasureInfo[i].series;
        for (key in settings) {
          value = settings[key];

          if (key == "seriesTypeCALL" && value) {
            var typeOptions = getSeriesTypeOptions(layout.opt.chartType);
            if (typeOptions.filter(function(d) {
                  return d.value === value
                }).length == 0) {
              consistency = false;
              // Remember series index to reset it's type
              seriesTypes.push(i);
            }
          }
        }
      }
    }

    if (!consistency) {
      view.backendApi.getProperties().then(function(reply) {
        reply.opt.chartSubtype = subtype ? subtype : reply.opt.chartSubtype;
        if (seriesTypes.length) {
          for (i in reply.qHyperCubeDef.qMeasures) {
            if (seriesTypes.indexOf(Number(i)) != -1) {
              reply.qHyperCubeDef.qMeasures[i].qDef.series.seriesTypeCALL = null;
            }
          }
        }
        view.backendApi.setProperties(reply);
      });
    }

    return consistency;
  };

  var updateSelections = function() {
    for (var s = 0; s < chart.getSeriesCount(); s++) {
      chart.getSeriesAt(s).select(selectedIndexes);
    }
  };

  var chart;
  var selectedIndexes = [];

  this.buildChart = function(view, layout) {

    if (!checkProperties(view, layout))
      return null;

    var typePreset = getChartTypePreset(layout.opt.chartType);
    var subtypePreset = getSubtypePreset(typePreset, layout.opt.chartSubtype);
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

    var data = matrix.map(function(d1) {
      dimIndexes.push(d1[0]['qElemNumber']);
      return d1.map(function(d2) {
        return Number(d2['qNum']) || (!isNaN(Number(d2['qText'])) ? Number(d2['qText']) : d2['qText']);
      });
    });

    // console.log(matrix[0][1]);
    // console.log(data[0]);

    //console.log("data: ", /*data,*/ dimIndexes);
    if (true || !chart || chartType != chartConstructor) { // Now always create new chart
      if (chart && typeof chart['dispose'] == 'function') {
        anychart.utils.hideTooltips();
        chart['dispose']();
      }

      // Create chart instance
      chart = anychart[chartConstructor]();

      // Events
      chart.interactivity().selectionMode('none');

      var pointClicked = false;
      chart.listen("mouseDown", function() {
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

        if (isSeriesBased)
          updateSelections();
      });

      view.clearSelectedValues = function() {
        selectedIndexes = [];
        if (isSeriesBased)
          updateSelections();
        else {
          switch (chartConstructor) {
              // Now we have only Pie
            case 'pie':
              chart.explodeSlices(false);
              break;
            default:
              break;
          }
        }
      };

      // Hide anychart's context menu
      chart.contextMenu(false);
    }

    var key;
    var value;
    var anychartPanelSettings = layout.opt.anychart;
    var chartPanelSettings = layout.opt.chart;
    var piePanelSettings = layout.opt.pie;

    // Applying panel chart settings
    //console.log("Anychart settings", anychartPanelSettings);
    for (key in anychartPanelSettings) {
      value = anychartPanelSettings[key];
      if (value)
        getset(anychart, key, value);
    }

    // Applying chart settings
    if (!isSeriesBased) {
      // Concat settings of the first series ('chart' and 'both')
      chartPanelSettings = concatObjects(chartPanelSettings, hc.qMeasureInfo[0].vary.chart, hc.qMeasureInfo[0].vary.both);
    }

    for (key in chartPanelSettings) {
      if (!isSeriesBased && (key.indexOf("xAxis") != -1 || key.indexOf("yAxis") != -1)) continue;

      value = chartPanelSettings[key];
      if (key == "paletteCALL") {
        value = anychart['palettes'][value];
      }
      if(value)
        getset(chart, key, value);
    }

    // Applying subtype settings
    for (key in presetSettings) {
      getset(chart, key, presetSettings[key]);
    }

    // Applying pie settings
    if(layout.opt.chartType == chartTypes.PIE_CHART) {
      for (key in piePanelSettings) {
        value = piePanelSettings[key];

        if(key == "insideLabelsOffsetCALL" || key == "innerRadiusCALL") {
          value += "%";
        }
        if (value)
          getset(chart, key, value);
      }
    }

    // Create data.set from prepared data
    var dataSet = anychart.data.set(data);

    // console.log(hc.qMeasureInfo[0]);
    if (isSeriesBased) {
      // Create series and apply panel series settings
      chart.removeAllSeries();

      var i;
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
        seriesPanelSettings = concatObjects(seriesPanelSettings, hc.qMeasureInfo[i].vary.series, hc.qMeasureInfo[i].vary.both);

        //console.log("Series settings", seriesPanelSettings);
        for (key in seriesPanelSettings) {
          value = seriesPanelSettings[key];

          if (key == "seriesTypeCALL" && !value) {
            continue;
          }
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
