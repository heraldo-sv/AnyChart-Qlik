define([], function() {
  'use strict';

  return {
    seriesStandard: {
      type: "items",
      label: "Series settings",
      items: {
        seriesType: {
          type: "string",
          component: "dropdown",
          label: "Type",
          ref: "qDef.series.seriesTypeCALL",
          defaultValue: null,
          options: function(l, g){
            return getSeriesTypeOptions(g.layout.opt.chartType);
          },
          show: function(l, g) {
            return getChartTypePreset(g.layout.opt.chartType)['isSeriesBased'];
          }
        },
        seriesMarkers: {
          type: "boolean",
          label: "Markers",
          ref: "qDef.series.markersCALL",
          defaultValue: false,
          show: function(l, g) {
            return getChartTypePreset(g.layout.opt.chartType)['isSeriesBased'];
          }
        },
        seriesLabels: {
          ref: "qDef.series.labelsCALL",
          type: "boolean",
          label: "Show labels",
          defaultValue: false
        },
        labelsFormatter: {
          ref: "qDef.series.labelsCALL_textFormatterCALL",
          type: "string",
          label: "Labels formatter",
          defaultValue: "{%Value}{decimalsCount:2} BLAH!",
          //defaultValue: "{%PercentValue}{decimalsCount:1,zeroFillDecimals:true}%",
          show: function(l) {
            return l.qDef.series.labelsCALL;
          }
        }
      }
    }
  };
});
