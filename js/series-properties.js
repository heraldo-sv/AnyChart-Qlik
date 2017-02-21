define([], function() {
  'use strict';

  var seriesType = {
    type: "string",
    component: "dropdown",
    label: "Type",
    ref: "qDef.series.seriesTypeCALL",
    //defaultValue: "default",
    options: function(l, g){
      return getSeriesTypeOptions(g.layout.opt.chartType);
    },
    show: function(l, g) {
      return getChartTypePreset(g.layout.opt.chartType)['isSeriesBased'];
    }
  };

  var seriesMarkers = {
    type: "boolean",
    label: "Markers",
    ref: "qDef.series.markersCALL",
    defaultValue: false,
    show: function(l, g) {
      return getChartTypePreset(g.layout.opt.chartType)['isSeriesBased'];
    }
  };

  var seriesStandard = {
    type: "items",
    label: "Series settings",
    items: {
      seriesType: seriesType,
      seriesMarkers: seriesMarkers
    }
  };

  return {
    seriesStandard: seriesStandard
  };
});
