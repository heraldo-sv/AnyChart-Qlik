var ACBuilder = function() {

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
    var xAxisOrientation = null;
    var yAxisOrientation = null;
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

    if (typePreset.isSeriesBased) {
      /******** Check series types ***/
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

      /****** Check axis settings for vertical charts ***/
      // Swap axis orientation for vertical charts
      var xAxisOpt = layout.opt.chart.xAxisCALL_orientationCALL;
      var yAxisOpt = layout.opt.chart.yAxisCALL_orientationCALL;
      if(typePreset.isVertical) {
        xAxisOrientation = (xAxisOpt == "bottom" || xAxisOpt == "top") ? "left" : xAxisOpt;
        yAxisOrientation = (yAxisOpt == "left" || yAxisOpt == "right") ? "bottom" : yAxisOpt;
      } else {
        xAxisOrientation = (xAxisOpt == "left" || xAxisOpt == "right") ? "bottom" : xAxisOpt;
        yAxisOrientation = (yAxisOpt == "bottom" || yAxisOpt == "top") ? "left" : yAxisOpt;
      }
    }

    if (!consistency) {
      view.backendApi.getProperties().then(function(reply) {
        reply.opt.chartSubtype = subtype ? subtype : reply.opt.chartSubtype;
        reply.opt.chart.xAxisCALL_orientationCALL = xAxisOrientation;
        reply.opt.chart.yAxisCALL_orientationCALL = yAxisOrientation;

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

  var _static = {
    /**
     * 'chartId' : {'chart': Object, 'selected': integer[]}
     */
  };

  this.updateSelections = function(id) {
    for (var s = 0; s < _static[id]['chart'].getSeriesCount(); s++) {
      _static[id]['chart'].getSeriesAt(s).select(_static[id]['selected']);
    }
  };

  this.buildChart = function(view, layout) {
    if (!checkProperties(view, layout))
      return null;

    var self = this;
    var id = layout.qInfo.qId;
    var hc = layout.qHyperCube;

    var typePreset = getChartTypePreset(layout.opt.chartType);
    var subtypePreset = getSubtypePreset(typePreset, layout.opt.chartSubtype);
    var chartConstructor = subtypePreset.ctor || typePreset.ctor;
    var isSeriesBased = typePreset.isSeriesBased;
    var defaultSeriesType = isSeriesBased ? subtypePreset.seriesType : null;
    var presetSettings = subtypePreset.settings || {};
    var dimIndexes = [];

    if (!_static[id]) {
      _static[id] = {chart: null, selected: []};
    }
    _static[id]['selected'] = [];

    // Prepare data
    var matrix = hc.qDataPages[0].qMatrix;

    var data = matrix.map(function(d1) {
      dimIndexes.push(d1[0]['qElemNumber']);
      return d1.map(function(d2) {
        return Number(d2['qNum']) || (!isNaN(Number(d2['qText'])) ? Number(d2['qText']) : d2['qText']);
      });
    });

    // console.log("====================", chartConstructor);
    // console.log(matrix[0]);
    // console.log(data[0]);

    if (_static[id]['chart'] && typeof _static[id]['chart']['dispose'] == 'function') {
      anychart.utils.hideTooltips();
      _static[id]['chart'].dispose();
    }

    // Create chart instance
    _static[id]['chart'] = anychart[chartConstructor]();

    // Selections processing
    _static[id]['chart'].interactivity().selectionMode('none');

    var pointClicked = false;
    _static[id]['chart'].listen("mouseDown", function() {
      if (!pointClicked) {
        _static[id]['chart'].dispatchEvent("pointMouseDown");
      }
      pointClicked = false;
    });

    _static[id]['chart'].listen("pointMouseDown", function(evt) {
      if (evt.pointIndex != undefined) {
        pointClicked = true;

        view.selectValues(0, [dimIndexes[evt.pointIndex]], true);

        var index = _static[id]['selected'].indexOf(evt.pointIndex);
        if (index == -1) {
          _static[id]['selected'].push(evt.pointIndex);
        } else {
          _static[id]['selected'].splice(index, 1);
        }
      }

      if (isSeriesBased)
        self.updateSelections(id);
    });

    view.clearSelectedValues = function() {
      _static[id]['selected'] = [];
      if (isSeriesBased)
        self.updateSelections(id);
      else {
        switch (chartConstructor) {
            // Now we have only Pie
          case 'pie':
            _static[id]['chart'].explodeSlices(false);
            break;
          default:
            break;
        }
      }
    };

    // Hide anychart's context menu
    _static[id]['chart'].contextMenu(false);

    var key;
    var value;
    var anychartSettings = layout.opt.anychart;
    var chartSettings = layout.opt.chart;
    var pieSettings = concatObjects(layout.opt.pie, hc.qMeasureInfo[0].opt.pie);

    // Applying gobal settings
    for (key in anychartSettings) {
      value = anychartSettings[key];
      if (key == 'licenseKeyCALL' && !value) {
        // do nothing
      } else if (value != void 0) {
        getset(anychart, key, value);
      }
    }

    for (key in chartSettings) {
      if (!isSeriesBased && (key.indexOf("xAxis") != -1 || key.indexOf("yAxis") != -1)) continue;

      value = chartSettings[key];
      if (key == "paletteCALL") {
        value = anychart['palettes'][value];
      }

      if (value != undefined)
        getset(_static[id]['chart'], key, value);
    }

    // Applying subtype settings
    for (key in presetSettings) {
      getset(_static[id]['chart'], key, presetSettings[key]);
    }

    // Applying pie settings
    if (layout.opt.chartType == chartTypes.PIE_CHART) {
      for (key in pieSettings) {
        value = pieSettings[key];

        if (key == "insideLabelsOffsetCALL" || key == "innerRadiusCALL") {
          value += "%";
        }
        if (value != undefined)
          getset(_static[id]['chart'], key, value);
      }
    }

    // Create data.set from prepared data
    var dataSet = anychart.data.set(data);

    // console.log(hc.qMeasureInfo[0]);
    if (isSeriesBased) {
      // Create series and apply panel series settings
      _static[id]['chart'].removeAllSeries();

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
        var series = _static[id]['chart'][defaultSeriesType](seriesData);
        series.name(hc.qMeasureInfo[i]['qFallbackTitle']);

        var seriesSettings = hc.qMeasureInfo[i].series;
        for (key in seriesSettings) {
          value = seriesSettings[key];

          if (key == "seriesTypeCALL" && !value) {
            continue;
          }
          getset(series, key, value);
        }
      }
    } else {
      // Just add data to chart
      _static[id]['chart'].data(dataSet);
    }

    // debug
    //window['chart'] = chart;

    return _static[id]['chart'];
  };
};
